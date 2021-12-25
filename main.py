# from auth import auth
import requests
import json
import os
import time
import threading
from bs4 import BeautifulSoup as soup
# Create a file named auth.py and paste this
# auth = {'eid': 'username', 'pw': 'pass', 'submit': 'Giriş'}
# And change 'username' and 'pass' with your credentials


# Username and password


siteLink = 'https://online.deu.edu.tr'
loginurl = siteLink + '/relogin'

# Logged in kalmak için tüm işlemleri session içinde yapıyoruz
with requests.session() as s:

    senddata = s.post(loginurl, data=auth)

    def verifyUser():
        if "şifreniz hatalı" in senddata.text:
            print("Hatalı kullanıcı adı veya şifre")
            return False
        else:
            return True

    def getDersIDAndNames():
        isUser = verifyUser()
        if isUser:

            site_url = siteLink + '/portal/favorites/get'
            response = s.get(site_url)

            result_json = json.loads(response.text)
            ders_IDs = result_json['favoriteSiteIds']

            ders_Names = []
            hoca_Names = []
            for i in range(len(ders_IDs)):

                site_url = siteLink + '/direct/site/' + ders_IDs[i] + '.json'
                response = s.get(site_url)
                result = json.loads(response.text)

                getDersNamesFromJson = result['entityTitle']
                getHocaNamesFromJson = result["props"]["contact-name"]
                ders_Names.append(getDersNamesFromJson)
                hoca_Names.append(getHocaNamesFromJson)

            items = ["dersName", "dersId", "dersHoca"]

            merge = []
            for i in range(len(ders_IDs)):
                merge.append([ders_Names[i], ders_IDs[i], hoca_Names[i]])

            list_json = [dict(zip(items, item)) for item in merge]

            with open('dersler.json', 'w') as f:

                f.write(json.dumps(list_json))
                f.close()
        else:
            return False

    class Ders:
        def __init__(self, name, id, hoca, odev=["Yok"], duyuru=["Yok"], meeting=[]):
            self.name = name
            self.id = id
            self.hoca = hoca
            self.odev = odev
            self.duyuru = duyuru
            self.meeting = meeting
        # Duyuruları al ve self.duyuru ya kaydet

        def getAnnouncement(self):
            # Dersin json urlsi
            site_URL = "https://online.deu.edu.tr/direct/announcement/site/" + self.id + ".json"
            response = s.get(site_URL)

            # Hatalı dosya çıkabiliyor o yüzden try except bloğu kullandım
            try:
                result = json.loads(response.content)
                a = result["announcement_collection"]
            except:
                a = []
            # placeholder olarak kullanıyorum "b" değişkenini nedense direk self.duyuru ya appendlediğimde tüm dersler için değiştiriyor.
            b = []
            for i in range(len(a)):
                b.append(soup(a[i]["body"], "html.parser").text)
            self.duyuru = b

        def getAssignment(self):

            site_URL = "https://online.deu.edu.tr/direct/assignment/site/" + self.id + ".json"

            response = s.get(site_URL)

            if response.status_code == 404:
                pass

            else:
                result = json.loads(response.text)
                a = result["assignment_collection"]
                if a == []:
                    pass
                else:
                    ödevlist = []
                    for i in range(len(a)):
                        # Ödev in saatini epoch cinsinden alıp prettify ediyorum.
                        if a[i]["dueTime"]["epochSecond"] + 9000 - time.time() > 0:
                            getDueTime = a[i]["dueTime"]["epochSecond"] + 9000
                            convertToTuple = time.gmtime(getDueTime)
                            time_string = time.strftime("%d/%m/%Y, %H:%M:%S", convertToTuple)
                            # Ödevin body kısmı
                            odevContent = soup(a[i]["instructions"], "html.parser").text
                            ödevlist.append({"dueTime": time_string, "content": odevContent})
                    self.odev = ödevlist

        def getMeetingIdAndJoin(self):

            site_URL = "https://online.deu.edu.tr/direct/bbb-tool.json?siteId=" + self.id
            response = s.get(site_URL)
            result = json.loads(response.text)
            a = result["bbb-tool_collection"]
            meetings = []
            for i in range(len(a)):
                # Eğer toplantının başlama saati 2+ saati geçmişse id sini alma
                if (int(time.time()) - int(str(a[i]["startDate"])[:-3])) < 100000:
                    meetingStartDate = a[i]["startDate"] / 1000 + 9000+1800
                    convertToTuple = time.gmtime(meetingStartDate)
                    time_string = time.strftime("%d/%m/%Y, %H:%M:%S", convertToTuple)
                    # Aldığın id ler valid mi ?
                    site_URL = "https://online.deu.edu.tr/direct/bbb-tool/" + a[i]["id"] + "/joinMeeting"
                    response = s.get(site_URL)

                    if "alreadyEnded" in response.text:
                        isMeetingStarted = "Ended"
                    elif "notStarted" in response.text:
                        isMeetingStarted = "Scheculed"
                    else:
                        isMeetingStarted = True
                    meetings.append({"meetingId": a[i]["id"], "meetingStartDate": time_string,
                                    "siteName": self.name, "available": isMeetingStarted, "meetingUrl": site_URL})
                self.meeting = meetings

# İlk kez çalıştırılıyorsa
if os.path.isfile("dersler.json"):
    # Ders bilgisini dosyadan al
    with open("dersler.json", "r") as f:
        dersInfo = json.loads(f.read())
else:
    a = getDersIDAndNames()
    if a:
        with open("dersler.json", "r") as f:
            dersInfo = json.loads(f.read())
    else:
        print("Dersler alınamadı")
        exit()

# Ders objelerini oluştur.
dersler = []
for i in range(len(dersInfo)):
    dersler.append(Ders(dersInfo[i]["dersName"], dersInfo[i]["dersId"], dersInfo[i]["dersHoca"]))

# Threading

duyurular = [threading.Thread(target=dersler[i].getAnnouncement, args=()) for i in range(len(dersler))]
ödevler = [threading.Thread(target=dersler[i].getAssignment, args=()) for i in range(len(dersler))]
meetingler = [threading.Thread(target=dersler[i].getMeetingIdAndJoin, args=()) for i in range(len(dersler))]

for i in range(len(dersler)):
    duyurular[i].start()
    ödevler[i].start()
    meetingler[i].start()
for i in range(len(dersler)):
    # Threadi bitir
    duyurular[i].join()
    ödevler[i].join()
    meetingler[i].join()
# dersler[5].getAnnouncement()
# dersler[5].getAssignment()
# dersler[5].getMeetingIdAndJoin()

# for i in range(len(dersler)):
#     print(dersler[i].name)
#     print("MEETING :", dersler[i].meeting)
    # print("DUYURU :", dersler[i].duyuru)
    # print("ODEV :", dersler[i].odev)
# print(dersler[5].odev)

# for i in range(len(dersler)):
#     for j in range(len(dersler[i].odev)):
#         h = dersler[i].odev[j]
#         if h != "Yok":
#             print(h["content"])
