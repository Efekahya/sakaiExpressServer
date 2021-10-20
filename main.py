import requests
import json
from bs4 import BeautifulSoup as soup
import os
import time

start_time = time.time()

auth = {"eid": "username", "pw": "pass", "submit": "Giriş"}

siteLink = "https://online.deu.edu.tr"
loginurl = siteLink + "/relogin"

with requests.session() as s:

    senddata = s.post(loginurl, data=auth)

    def getDersID():

        site_url = siteLink + "/portal/favorites/get"
        response = s.get(site_url)

        if response.status_code != 200:
            print("Servere Ulaşılamadı!")
            if os.path.isfile("ders_ID.json"):
                print("Daha önce getirilmiş dersler kullanılıyor")
            else:
                print("Daha sonra tekrar deneyin!")
                exit()
        else:
            result = json.loads(response.text)
            site_ID = result["favoriteSiteIds"]

            with open("ders_ID.json", "w") as f:
                f.write(json.dumps(site_ID))
                f.close()

    def convertDersNames():

        with open("ders_ID.json", "r") as f:
            ders_ID = json.load(f)

        ders_Names = []

        for i in range(len(ders_ID)):
            site_url = siteLink + "/direct/site/" + ders_ID[i] + ".json"
            response = s.get(site_url)
            source = soup(response.content, "html.parser")
            result = json.loads(source.text)
            names = result["entityTitle"]
            ders_Names.append(names)

        with open("ders_Name.json", "w", encoding="utf-8") as f:
            f.write(json.dumps(ders_Names))

    def getAssignment(x):
        with open("ders_Name.json", "r", encoding="utf-8") as f:
            ders_Name = json.loads(f.read())
        with open("ders_ID.json", "r") as f:
            ders_ID = json.loads(f.read())

        site_URL = "https://online.deu.edu.tr/direct/assignment/site/" + ders_ID[x] + ".json"
        response = s.get(site_URL)
        source = soup(response.content, "html.parser")

        if response.status_code == 404:
            print("Ders için Ödevler kısmı oluşturulmamış !")
        else:
            result = json.loads(source.text)
            a = result["assignment_collection"]

            print("***********" + ders_Name[x] + "***********")

            if a == []:
                print("Daha hiçbir ödev yok!")
                print()
            else:

                for i in range(len(a)):
                    getDueTime = a[i]["dueTime"]["epochSecond"]
                    convertToTuple = time.gmtime(getDueTime)
                    time_string = time.strftime("%d/%m/%Y, %H:%M:%S", convertToTuple)
                    print("Ödev " + str(i + 1))
                    print()
                    print(soup(a[i]["instructions"], "html.parser").prettify())
                    print("Teslim Tarihi : " + time_string)
                    print()
                    print()

    def getAnnouncement(x):
        with open("ders_Name.json", "r", encoding="utf-8") as f:
            ders_Name = f.read()
        with open("ders_ID.json", "r") as f:
            ders_ID = json.loads(f.read())

        site_URL = "https://online.deu.edu.tr/direct/announcement/site/" + ders_ID[x] + ".json"

        response = s.get(site_URL)
        source = soup(response.content, "html.parser")
        if response.status_code == 404:
            pass
            print("Ders için duyurular kısmı oluşturulmamış !")
            print()
        else:
            try:

                result = json.loads(source.text)
            except:
                print(
                    "Dosya İşlenemedi! (Bu genelde daha önceden kayıtlı olduğunuz bir dersin silinmesinden kaynaklanır)"
                )
                result = json.loads('{"announcement_collection": []}')
            a = result["announcement_collection"]
            print("***********" + ders_Name[x] + "***********")
            if a == []:
                print("Daha hiçbir duyuru yok!")
                print()
            else:

                for i in range(len(a)):

                    print("Duyuru " + str(i + 1))
                    print()
                    print(a[i]["createdByDisplayName"])
                    print(soup(a[i]["body"], "html.parser").prettify())
                    print()
                    print()

    def getMeetingId():

        with open("ders_ID.json", "r") as f:
            ders_ID = json.loads(f.read())
        meeting_ID = []
        for i in range(len(ders_ID)):

            site_URL = "https://online.deu.edu.tr/direct/bbb-tool.json?siteId=" + ders_ID[i]

            response = s.get(site_URL)

            if response.status_code != 200:
                print("Servere Ulaşılamadı!")
                if os.path.isfile("meeting_ID.json"):
                    print("Daha önce getirilmiş meeting Id ler kullanılıyor")
                else:
                    print("Daha sonra tekrar deneyin!")
                    exit()

            source = soup(response.content, "html.parser")
            result = json.loads(source.text)
            a = result["bbb-tool_collection"]

            for i in range(len(a)):
                meeting_ID.append(a[i]["id"])
            with open("meeting_ID.json", "w") as f:
                f.write(json.dumps(meeting_ID))
                f.close()

    def joinmeeting():

        with open("meeting_ID.json", "r") as f:
            meeting_ID = json.load(f)
        with open("ders_Name.json", "r", encoding="utf-8") as f:
            ders_Name = f.read()
            ders_Name = json.loads(ders_Name)
        with open("ders_ID.json", "r") as f:
            ders_ID = f.read()
            ders_ID = json.loads(ders_ID)
        for i in range(len(meeting_ID)):

            getSiteNameFromMeeting_URL = "https://online.deu.edu.tr/direct/bbb-tool/" + meeting_ID[i] + ".json"

            siteNameFromMeeting = s.get(getSiteNameFromMeeting_URL)
            siteNameSource = soup(siteNameFromMeeting.content, "html.parser")
            siteNameResult = json.loads(siteNameSource.text)
            siteID = siteNameResult["siteId"]
            index = ders_ID.index(siteID)

            meetingStartDate = siteNameResult["startDate"] / 1000 + 10800
            convertToTuple = time.gmtime(meetingStartDate)
            time_string = time.strftime("%d/%m/%Y, %H:%M:%S", convertToTuple)

            site_URL = "https://online.deu.edu.tr/direct/bbb-tool/" + meeting_ID[i] + "/joinMeeting"
            response = s.get(site_URL)

            source = soup(response.content, "html.parser")
            if "alreadyEnded" in source.text:
                pass
            elif "notStarted" in source.text:
                print(ders_Name[index])
                print("Canlı Ders Daha Başlamadı.")
                print(time_string)
            else:
                print(ders_Name[index])
                print(site_URL)

    def user():

        user_URL = "https://online.deu.edu.tr/direct/user/current.json"
        responseForUser = s.get(user_URL)
        userInfo = json.loads(responseForUser.text)
        userId = userInfo["id"]
        name = userInfo["displayName"]

        alerts_URL = "https://online.deu.edu.tr/direct/portal/bullhornAlerts.json"
        responseForAlerts = s.get(alerts_URL)
        alertInfo = json.loads(responseForAlerts.text)["message"]

        messages_URL = "https://online.deu.edu.tr/direct/profile/" + str(userId) + "/unreadMessagesCount.json"
        responseForMessages = s.get(messages_URL)
        messages = str(responseForMessages.text)

        print()
        print(name)
        print("Bildirimler :", alertInfo)
        print("Mesaj Sayısı :", messages)
        print()


if os.path.isfile("ders_ID.json"):

    with open("ders_ID.json", "r") as f:
        ders_ID = f.read()
        ders_ID = json.loads(ders_ID)

else:
    getDersID()
    convertDersNames()
    with open("ders_ID.json", "r") as f:
        ders_ID = f.read()
        ders_ID = json.loads(ders_ID)

while True:
    print("********** Sakai The Convenient One v.1.0 *********")
    secim = int(input("1. Ödevlerim\n2. Duyurular\n3. Toplantılar\n4. Profilim\n5. Credits\n6. Çıkış\n"))

    if secim == 1:
        for i in range(len(ders_ID)):
            getAssignment(i)
    elif secim == 2:
        for i in range(len(ders_ID)):
            getAnnouncement(i)
    elif secim == 3:
        getMeetingId()
        joinmeeting()
    elif secim == 4:
        user()
    elif secim == 5:
        print("Author : Efe Kahyaoğlu")
        print("Contact: efekahya.ek@gmail.com")
    elif secim == 6:
        exit()
