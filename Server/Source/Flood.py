# * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
# * Licensed under the MIT license. See LICENSE file in the project root
# * for full license information.
# *
# * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
# *
# * The OpenDeyim Source Code
# * A free, modern, self-hosted and open source translation service that instantly 
# * translates phrases, words and web pages into more than 30 languages. Use our 
# * API or bindings and experiment with OpenDeyim.
# * 
# * For more information, please read the documentation inside 
# * the <README.md> file which is located at the root of this directory or source code.
# * 
# * Consider that, OpenDeyim, has parts of the LibreTranslate source code, despite 
# * the fact that it has been rewritten from scratch, removing functionalities from the 
# * original backend, reducing it to only one API under Flask, however, OpenDeyim, as 
# * of its publication, is completely misaligned With updates or implementations that 
# * LibreTranslate eventually receives, OpenDeyim does not claim to be a copy of it.
# * 
# * (www.github.com/codewithrodi/OpenDeyim/)
# * 
# * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
# * Full Stack Software Developer.
# *
# * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

import atexit
from apscheduler.schedulers.background import BackgroundScheduler

Banned = {}
Active = False
Threshold = -1

def ForgiveBanned() -> None:
    global Banned
    global Threshold
    ClearList = []
    for IP in Banned:
        if Banned[IP] <= 0:
            ClearList.append(IP)
        else:
            Banned[IP] = min(Threshold, Banned[IP]) - 1
    for IP in ClearList:
        del Banned[IP]

def Setup(ViolationsThreshold = 100) -> None:
    global Active
    global Threshold
    Active = True
    Threshold = ViolationsThreshold
    Scheduler = BackgroundScheduler()
    Scheduler.add_job(func = ForgiveBanned, trigger = 'interval', minutes = 30)
    Scheduler.start()
    atexit.register(lambda: Scheduler.shutdown())

def Report(RequestIP) -> None:
    if Active:
        Banned[RequestIP] = Banned.get(RequestIP, 0)
        Banend[RequestIP] += 1

def Decrease(RequestIP) -> None:
    if Banned[RequestIP] > 0:
        Banned[RequestIP] -= 1

def HasViolation(RequestIP) -> None:
    return RequestIP in Banned and Banned[RequestIP] > 0

def IsBanned(RequestIP) -> None:
    return Active and Banned.get(RequestIP, 0) >= Threshold