import requests
import json
from bs4 import BeautifulSoup as soup
import os
import time
import threading
from tkinter import *
# Username and password
auth = {'eid': 'username', 'pw': 'pass', 'submit': 'Giriş'}
siteLink = 'https://online.deu.edu.tr'
loginurl = siteLink + '/relogin'


# Logged in kalmak için tüm işlemleri session içinde yapıyoruz
with requests.session() as s:
    senddata = s.post(loginurl, data=auth)

    def getDersIDAndNames():

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

            source = soup(response.content, "html.parser")
            # Hatalı dosya çıkabiliyor o yüzden try except bloğu kullandım
            try:
                result = json.loads(source.text)
                a = result["announcement_collection"]
            except:
                a = []
            # placeholder olarak kullanıyorum "b" değişkenini nedense direk self.duyuru ya appendlediğimde tüm dersler için değiştiriyor.
            b = []
            for i in range(len(a)):
                b.append(soup(a[i]["body"], "html.parser").prettify())
            self.duyuru = b

        def getAssignment(self):

            site_URL = "https://online.deu.edu.tr/direct/assignment/site/" + self.id + ".json"
            response = s.get(site_URL)
            source = soup(response.content, "html.parser")

            if response.status_code == 404:
                pass
            else:
                result = json.loads(source.text)
                a = result["assignment_collection"]

                if a == []:
                    pass
                else:
                    ödevlist = []
                    for i in range(len(a)):
                        # Ödev in saatini epoch cinsinden alıp prettify ediyorum.
                        getDueTime = a[i]["dueTime"]["epochSecond"]
                        convertToTuple = time.gmtime(getDueTime)
                        time_string = time.strftime("%d/%m/%Y, %H:%M:%S", convertToTuple)
                        # Ödevin body kısmı
                        odevContent = soup(a[i]["instructions"], "html.parser").prettify()
                        ödevlist.append({"dueTime": time_string, "content": odevContent})
                    self.odev = ödevlist

        def getMeetingIdAndJoin(self):

            site_URL = "https://online.deu.edu.tr/direct/bbb-tool.json?siteId=" + self.id
            response = s.get(site_URL)
            result = json.loads(response.text)
            a = result["bbb-tool_collection"]
            meetings = []
            for i in range(len(a)):
                # Eğer toplantının başlama saati 1 saati geçmişse id sini alma
                if (int(time.time()) - int(str(a[i]["startDate"])[:-3])) < 3600:
                    meetingStartDate = a[i]["startDate"] / 1000 + 9000
                    convertToTuple = time.gmtime(meetingStartDate)
                    time_string = time.strftime("%d/%m/%Y, %H:%M:%S", convertToTuple)
                    # Aldığın id ler valid mi ?
                    site_URL = "https://online.deu.edu.tr/direct/bbb-tool/" + a[i]["id"] + "/joinMeeting"
                    response = s.get(site_URL)

                    if "alreadyEnded" in response.text:
                        pass
                    elif "notStarted" in response.text:
                        isMeetingStarted = False
                    meetings.append({"meetingId": a[i]["id"], "meetingStartDate": time_string,
                                     "siteName": self.name, "available": isMeetingStarted, "meetingUrl": site_URL})
                self.meeting = meetings

# İlk kez çalıştırılıyorsa
if os.path.isfile("dersler.json"):
    # Ders bilgisini dosyadan al
    with open("dersler.json", "r") as f:
        dersInfo = json.loads(f.read())
else:
    getDersIDAndNames()
    with open("dersler.json", "r") as f:
        dersInfo = json.loads(f.read())

# Ders objelerini oluştur.
dersler = []
for i in range(len(dersInfo)):
    dersler.append(Ders(dersInfo[i]["dersName"], dersInfo[i]["dersId"], dersInfo[i]["dersHoca"]))

# Threading
duyurular = [threading.Thread(target=dersler[i].getAnnouncement, args=()) for i in range(len(dersler))]
ödevler = [threading.Thread(target=dersler[i].getAssignment, args=()) for i in range(len(dersler))]
meetingler = [threading.Thread(target=dersler[i].getMeetingIdAndJoin(), args=()) for i in range(len(dersler))]

for i in range(len(dersler)):
    duyurular[i].start()
    ödevler[i].start()
    meetingler[i].start()
    # Threadi bitir
    duyurular[i].join()
    ödevler[i].join()
    meetingler[i].join()

# ------------ Tkinter-----------
window = Tk()
window.title("Convenient Sakai v1.1")
window.geometry("800x400")

listbox = Listbox(window, height=20, width=80)


def showDersler():
    listbox.delete("0", "end")
    for i in range(len(dersler)):
        listbox.insert(i, dersler[i].name)
    listbox.pack()


def showDuyurular():
    listbox.delete("0", "end")
    for i in range(len(dersler)):
        for j in range(len(dersler[i].duyuru)):
            listbox.insert(i, dersler[i].duyuru[j])
    listbox.pack()


def showOdevler():
    listbox.delete("0", "end")
    for i in range(len(dersler)):
        for j in range(len(dersler[i].odev)):
            listbox.insert(i, dersler[i].odev[j])
    listbox.pack()


def showCanlıDersler():
    listbox.delete("0", "end")
    for i in range(len(dersler)):
        for j in range(len(dersler[i].meeting)):
            listbox.insert(i, dersler[i].meeting[j])
    listbox.pack()


b1 = Button(window, text="Derslerim", command=showDersler)
b1.pack()

b2 = Button(window, text="Duyurularım", command=showDuyurular)
b2.pack()

b3 = Button(window, text="Ödevlerim", command=showOdevler)
b3.pack()

b4 = Button(window, text="Canlı Dersler", command=showCanlıDersler)
b4.pack()

window.mainloop()
