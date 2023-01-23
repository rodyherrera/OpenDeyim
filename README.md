## OpenDeyim - Self-Hosted Translation Software.
[Visit the public DEMO of the software.](https://opendeyim.codewithrodi.com/)
OpenDeyim is a modern open source translation software, capable of self-hosting. This is built with two technologies, these being ReactJS and Python creating separate environments for their respective development, likewise, giving the end user an enriched experience before the React application.

![Presentation of the platform](https://github.com/CodeWithRodi/OpenDeyim/blob/main/Screenshots/Presentation.png?raw=true)

The development of this platform arises through the abstract art that encompasses the sharing of ideas and knowledge between the different cultures that lie in the world; Inspired by open-source, collaboration and teamwork, taking good ideas and improving them even more in a systematic and progressive way, in order to serve as a great source of inspiration.

Within the backend written in Python, you can find a Flask server which can be run via <gunicorn>, a published API where it is primarily consumed by the ReactJS application.

Consider that the API can be used by tertiary clients, as well as, it is relevant to mention that within the client application, there is a specific section where it is graphically illustrated through explicit code, how you can make a request to the server's API.

### Table of Contents
- [What features does OpenDeyim offer you as self-hosted software?](#features)
- [Let's get started on installing the software.](#carrying-out-the-installation)
- [Starting and configuring our back-end server.](#starting-and-configuring-the-back-end-server)
- [Analyzing the available parameters that the server can receive.](#adjusting-our-server-configuration-through-arguments)
- [Learning how to pass parameters to the server both in its normal execution and in production with <gunicorn>.](#passing-parameters-to-the-server-via--and-the-normal-way-of-execution-with-python)
- [Starting and configuring the ENDPOINT within our front-end, the ReactJS application.](#starting-and-configuring-the-front-end-server)
- [Emphasis on the ENDPOINT configuration within the ReactJS application.](#configuring-the-endpoint-or-address-of-our-back-end)
- [Introducing us to the bindings available for the use of the OpenDeyim API by tertiary clients.](#introducing-the-api-bindings)
- [Installing or updating the Argos Translate templates that are used during translations; knowing where they are installed and what happens when removing them.](#installing-or-updating-the-models-for-the-translation)
- [Considering the use of external software for the development of OpenDeyim.](#considering-external-software)
- [Speaking and highlighting relevant points around SEO and the user experience that the client receives within the platform, our front-end.](#lets-talk-about-user-experience-and-seo)
- [Talking about the status of this software, its license and its openness to eventual contributions.](#open-to-contributions-and-updates)

### Features
- Voice translation into any language available within the translator.
- Integration of the CodexDrake search engine to perform searches in terms of translation to find related sites or images.
- Highly secure and anonymous, at no time is your data shared with third parties or with the server (back-end).
- Ability to listen by voice to a translation or what you want to translate, in the respective language where that translation is found.
- Other features such as copy to clipboard, character and phrase counter are available within the translation section of the platform.
- History of translations carried out satisfactorily.
- Highly friendly design with any type of device, integrating visual details and rich animations that enrich the user experience.
- Separate development environments, with Python as the backend and ReactJS as the front-end.
- Implementation of the public API, so that it can be used by other clients and not only from ReactJS, likewise, from the platform you get a tutorial on how to make requests.
- Bindings to different languages, through the implementation of the OpenDeyim API.
- No fees or subscriptions.
- Easy-to-use architectures in the front-end and back-end.
- Fully responsive, facilitating interaction with mobile phones or other devices.
- Others...

## Carrying out the installation
Next, you will be presented with a series of instructions or commands to be able to install OpenDeyim on your development computer or on a server where you want to self-host this translator.

Consider that, yes, you are hosting a backend that simply has an API written in Flask, but, we are self-hosting a translator, you must take into account that this requires computing, and that a standard server with 1/2 GB of ram probably won't. It will be enough for it to run optimally or efficiently.

Before proceeding with the installation and processing of the source code of this software on your machine, we must install a series of dependencies so that everything can go as expected.

```bash
# Updating packages.
sudo apt update

# Installing git python3 and then pip3.
sudo apt install git python3 python3-pip
```
    
Once you have <python3>, with <pip>, you shouldn't have any issues installing the server dependencies as well as getting it up and running. Consider, that I assume that you have NodeJS installed inside your machine or server, or that you will deploy the client application written in ReactJS on some platform like Vercel or Netlify.
    
```bash
# Cloning the repository that contains 
# the OpenDeyim source code.
git clone https://github.com/codewithrodi/OpenDeyim

# Accessing the generated directory 
# after cloning the repository
cd OpenDeyim

# Accessing the Client folder, where
# we find the source 
# code of the ReactJS application
cd Client/

# Installing the dependencies or modules 
# of the React application.
npm install --force

# Accessing the folder that contains the source 
# code of the Server, written in Python.
cd ../Server

# Installing the requirements or modules for 
# the operation of the server.
pip install -e .

# Installing the models for the correct functioning 
# of the translator, this will take a while.
python3 Utilities/InstallModels.py
```

Next, you have the series of commands exactly the same as the previous one, but with the difference that it is in only one line, so you only have to copy and paste it in your terminal to execute the processes; Sure, in case you don't want to follow the step by step.

```bash
git clone https://github.com/codewithrodi/OpenDeyim && cd OpenDeyim && cd Client/ && npm install --force && cd ../Server && pip install -e . && python3 Utilities/InstallModels.py
```

## Starting and configuring the back-end server
The backend server is written in Python, using Flask, we provide a public character API, which, through this, we can make it possible to use the translator through our client, which is written in ReactJS.

Next, you will be presented with the corresponding series of instructions that you must execute in order to start running or mount the backend server within the network.

Consider that, for the following series of instructions, I will assume that you are in the root of the OpenDeyim source code, that is, inside the folder generated after having cloned the repository.

```bash
# Entering the directory that contains the 
# source code of our backend server.
cd Server/

# We will mount our server on the network with 
# the help of gunicorn, consider that, in 
# --bind argument, you could eventually change the hosting address.
gunicorn --bind 0.0.0.0:5000 --workers=5 --threads=5 --worker-class=gthread -c Utilities/GunicornConfig.py 'WSGI:Application'

# Your server should be up and running! :D
```
Or, you may prefer the in-line command.
```bash
cd Server/ && gunicorn --bind 0.0.0.0:5000 --workers=5 --threads=5 --worker-class=gthread -c Utilities/GunicornConfig.py 'WSGI:Application'
```

Note that by using <gunicorn>, you would be mounting the server in a production-ready environment, but in case you want to use it as development, you can initialize the server as follows:

```bash
python3 Main.py
```

#### Adjusting our server configuration through arguments
We have previously seen two ways to initialize or mount our server on the network, then we will see how to set arguments to modify established default values that affect the operation of the server.

What am I trying to say? Next, you will learn how to establish, for example, the maximum amount allowed to translate, the default languages ​​that will be used in the frontend, establish an SSL certificate, among others.

| Parameter | Type     | Default Value | Description               |
| :-------- | :------- | :------------ | :------------------------ |
| `Host` | `String` | `0.0.0.0` | Address where you want to mount the server within the computer's network, by default this corresponds to <0.0.0.0>.|
| `Port` | `Integer` | `5000` | Port, which will use the address where the server will be mounted within the network, by default this corresponds to <5000>.|
| `CharacterLimit` | `Integer` | `2000` | Allows you to set the maximum number of characters to accept from an incoming translation request through the client, likewise, this value will be used to set the maximum length of characters within our ReactJS application.|
| `RequestFloodThreshold` | `Integer` | `-1` | Set the maximum number of request limit offences that a client can exceed before being banned.|
| `BatchLimit` | `Integer` | `-1` | Allows you to set the maximum number of texts to translate in a batch request. Consider that, by default, this is set to <-1>, so this means that it is unlimited.|
| `Debug` | `Boolean` | `False` | Allows you to set whether the application will run in development mode or not, by default this is set to False.|
| `SSL` | `Boolean` | `False` | Allow to enable SSL when the server is mounted on the computer or server network.|
| `FrontendLanguageSource` | `String` | `auto` | When you access the React application and go to the corresponding section where the translator is located, you will see that you have the respective selectors to change the language of the text to translate as well as the language you want to translate the text, this variable , it must receive an assignment value when passed as an argument in <ISO639-1> format, eg (en, es, de, ar...). So, when assigning this variable to 'de', for example, when entering our ReactJS application, we would be seeing that by default the source language will be German. By default, the value of this variable is 'auto', and I would not recommend changing it, so that, when entering the website, the client should only start typing a text, so that the language is auto-detected and facilitating the enriching the experience.|
| `FrontendLanguageTarget` | `String` | `en` | Exactly the same as the previous argument, the value of this variable must be in <ISO639-1> format, that is, it must contain a language code, such as (en, es, de, ar...), of So, this will be used within the ReactJS application, that is, our website where we can use our instance. Within the translator, where we have the source language and target language selectors, this corresponds to the target language, by default, this corresponds to English.|
| `FrontendTimeout` | `Integer` | `1500` |This variable is quite interesting, it MUST receive a certain number of milliseconds as a value, which will be used in our ReactJS application so that, when the user is typing to perform a certain translation, the amount of time in the translation will be measured. that the user STOPS writing, where, that amount of time corresponds to the one defined in this variable, by default the value is <1500>, that is, 1 second and 500 milliseconds, therefore, while the user writes his text to translate, as soon as he stops typing and no new typing is detected within 1500 milliseconds after he stopped typing, the translation request of the existing text typed by the user will be made to the server.|
| `LOAD_ONLY` | `String` | `None` | Allows you to load or enable a certain series of languages, you can, for example, only enable four languages ​​in the translator, separating them by commas, for example: --LoadOnly es,en,de,ar.|
| `UpdateModels` | `Boolean` | `False` | Allows updating ArgosTranslate models, by default it is set to False.|
| `URLPrefix` | `String` | `/api/v1` | It allows you to add a prefix to the API, by default it is assigned in </api/v1>, I would not recommend changing it, because if you do, you will also have to modify the endpoint on the client.|

#### Passing parameters to the server via <gunicorn> and the normal way of execution with Python
After having presented the whole series of available arguments that the server can receive, you must consider that the way in which the parameters are passed is not the same in <gunicorn> as executing directly from python the script that allows to start the server.

Next you will be shown an example of how the instruction to mount the server on the network is established through the normal execution of the server using <Python3> and not <gunicorn>.
```bash
python3 Main.py --Host 0.0.0.0 --Port 5000 
```
As you can see, we are assigning two arguments to the file call, which belong to <Host> and <Port> that were explained earlier in the table.
    
![Normal execution of the server using Python3](https://github.com/CodeWithRodi/OpenDeyim/blob/main/Screenshots/Generic-Server-Start.png?raw=true)

Next, you will be presented with an example of how to execute the server using <gunicorn> by passing arguments to the call.

```bash
gunicorn --bind 0.0.0.0:5000 --workers=5 --threads=5 --worker-class=gthread -c Utilities/GunicornConfig.py 'WSGI:Application(FrontendLanguageSource="en", FrontendLanguageTarget="es")'
```
In this case, in the example we are assigning two values to variables, where the first is <FrontendLanguageSource> while the second is <FrontendLanguageTarget>, both of which were explained in the table previously presented with all the available arguments.

![Starting server in production using <gunicorn>](https://github.com/CodeWithRodi/OpenDeyim/blob/main/Screenshots/Gunicorn-Server-Start.png?raw=true)

## Starting and configuring the front-end server
We have previously learned how to start and configure our back-end server written in Python, now it is the turn of our front-end server which is written in ReactJS.

Within other sections of this document (README.md), in the installation, I commented that I assume you already have NodeJS installed, so if you don't have it installed, you know what to do.

Consider that the ReactJS application cannot necessarily be mounted on your computer or server, if you want to run it in production with your instance, you can deploy the application on services such as Vercel or Netlify.

#### Configuring the endpoint or address of our back-end
Within the folder where the ReactJS application (Client/) is located, we can find the <src/> directory, which contains the application, within that folder, there is a file called <Infrastructure.json>, in which, They find various configurations on which various files within the application will depend.

The content of this <.json> file is not significant, in fact, when you open it you will only see a key, which is the <Server>, where its value must be the address of your back-end server.
```javascript
// [OpenDeyim/Client/src/Infrastructure.json]
{
    "Server": "https://deyimapi.codewithrodi.com/api/v1"
}
```

As you can see, in the attached code the address where the server is located is accompanied by the </api/v1> prefix, you must also add it next to your address where the back-end of your OpenDeyim instance is mounted.

Why /api/v1/?, because it is the default URL prefix, we talked about it earlier in the available server arguments table, for that reason, you should add this prefix, unless you set a prefix "/" in the respective variable as an argument when calling the server.

Once you have established within the file <Infrastructure.json> (/OpenDeyim/Client/src/Infrastructure.json) the endpoint or address of your back-end server of your instance, we will proceed to install the NodeJS packages to be able to make walk our application.

```bash
# [/OpenDeyim/Client/]
# Installing the packages required by the application.
npm i --force

# Once the ReactJS application dependencies have 
# been installed, we will proceed to start the application.
npm run start
```
Once the ReactJS application has been installed and initialized, as well as you have previously correctly configured the endpoint of the application to your server, it should be working without complications.

![View of the main page through the computer](https://github.com/CodeWithRodi/OpenDeyim/blob/main/Screenshots/Desktop/Home-Page.png?raw=true)

## Introducing the API bindings
Previously, as you were told, OpenDeyim is divided into two parts, its Backend and its Frontend, being the Backend the one that provides a public API to be consumed from the Frontend as well as from tertiary clients.

Within the source code of the distributed software, you can find a folder which is called <Bindings>, which, inside it, has other folders where, according to its name, it will contain the implementation of the OpenDeyim API to be able to be used.

Consider that you can directly use these bindings that are presented to you with your self-hosted instance of OpenDeyim, and not directly with the test server with which it is defined by default.

Within each folder that contains the respective binding for the agreed programming language, you will find in the file that implements the API an extensive or at least short and detailed explanation about what is being executed or done in terms of instruction that is performed within the code.

Consider that, in case you are interested in using those Bindings and not building your own client to make requests to your OpenDeyim instance, you must copy the respective file that contains the definition of the API implementation to be able to import it and use it within your projects or scripts.

Next, you will be shown the Python implementation of the OpenDeyim API, consider in the same way, review that folder and explore the various bindings that it has for your eventual developments and/or implementations that involve this software or your instance.

```python
# # # # # # # # <<
# [/OpenDeyim/Bindings/Python/Binding.py]
# # # # # # # # <<
import json, sys, requests
from typing import Any, Dict
from urllib import request, parse

class OpenDeyimAPI:
    DEFAULT_URL = 'https://deyimapi.codewithrodi.com/api/v1'

    def __init__(self, URL: str = None) -> None:
        self.URL = OpenDeyimAPI.DEFAULT_URL if URL is None else URL
        if self.URL[-1] != '/':
            self.URL += '/'

    def Translate(self, Query: str, Source: str = 'auto', Target: str = 'en', Format: str = 'text') -> Any:
        URL = self.URL + 'api/v1/translate'
        Response = requests.post(URL, json = {
            'Query': Query,
            'Source': Source,
            'Target': Target,
            'Format': Format })
        return json.loads(Response.text)['Data']['TranslatedText']

    def Detect(self, Query: str) -> Any:
        URL = self.URL + '/detect'
        Response = requests.post(URL, json = { 'Query': Query })
        return json.loads(Response.text)['Data']

    def Languages(self) -> Any:
        URL = self.URL + '/languages'
        return json.loads(requests.get(URL).text)['Data']
```

```python
# # # # # # # # <<
# [/OpenDeyim/Bindings/Python/Python.py]
# # # # # # # # <<

# ! By importing the official implementation of the 
# ! API, you can copy that file and use it in your projects 
# ! so that you can integrate your OpenDeyim instance inside Python.
from .Binding import OpenDeyimAPI

# ! Creating an instance of the class, where it receives as 
# ! a parameter in its '__init__' the URL of the OpenDeyim 
# ! server, which can be your self-hosted instance.
DeyimAPI = OpenDeyimAPI('https://deyimapi.codewithrodi.com/api/v1')

# ! In this example, the '.Detect' method receives a 
# ! String as a parameter, which will return another 
# ! String whose content will be the language of the parameter sent.
# ! This returns the language of whatever you send to it as a parameter.
print(DeyimAPI.Detect("Hello World!"))
# * [ { 'Confidence': 92.0, 'Language': 'en' } ]

# ! The '.Languages' method returns all the available 
# ! languages ​​that are operational to be able to use 
# ! them through the translation. This returns an array 
# ! of objects, where the object has two keys, where the 
# ! first one belongs to 'Code' which is the available 
# ! language and the second key corresponds to 'Target' which 
# !is an array containing all the languages ​​to which can be 
# ! translated into the language that has the 'Code' key.
# TODO: print(DeyimAPI.Languages())
# * [ { 'Code' '...', 'Targets': [...] } ]

# ! Next, the '.Translate' method will be used, which 
# ! receives 3 parameters, where the first is the content 
# ! to be translated, the second is the language in which 
# ! the content is to be translated, and finally the language 
# ! in which we wish to translate, Inside the script, we 
# ! make a loop with the help of a while so that when the 
# ! script is executed the user has the possibility to test 
# ! this method and see how when entering a text or phrase it 
# ! is returned in English. See, that when we call the function 
# ! inside the while loop, this as the second parameter receives 
# ! 'auto', this means that the language of the content which we 
# ! want to translate will be auto-detected to return it in 
# ! the set language (sent in the third parameter). .
# * Consider also that as the last parameter the translate method 
# * receives an optional value, which corresponds to the variable 
# * defined as <Format>, which can have two values, "text" or 
# * "html", in case the value of this be "text", you are indicating 
# * that the content you want to translate is merely content, while if 
# * you indicate "html", you are indicating to the server that you are 
# * sending html code to be translated, therefore, the return will be the 
# * html code translated into the language that you have established.
print('\nTranslation API working demo: Next you will enter a Loop where you can translate any text into English.')
while True:
    print(DeyimAPI.Translate(input('\nEnter the text to be translated into English: '), 'auto', 'en'))
# * Note that the Translate method only has one mandatory 
# * parameter, which is { Query }, whose value must contain the 
# * content or text you want to translate, the other parameters 
# * which are { Source, Target, Format } have the following values:
# * -> Source = 'auto' :: Automatic language detection of the content that has { Query }
# * -> Target = 'en' :: Based on the content sent in { Query }, if the value of <Target> 
# *                     is not specified it will be translated by default to English.
# * -> Format = 'text' :: The content that { Query } has will be text, in case it is 
# *                     HTML, you must reassign the value of <Format>.
```

![View of the main page through the computer](https://github.com/CodeWithRodi/OpenDeyim/blob/main/Screenshots/Python-Binding.png?raw=true)

## Installing or updating the models for the translation.
Previously, in the respective section where we installed this software, we have gone through the instructions to install the models required to run the translations satisfactorily once our back-end is mounted both locally and in production within the network.

Next, you will be presented with the command with which you can install the translation models, in case they are NOT installed.

```bash
# [/OpenDeyim/Server/]
python3 Utilities/InstallModels.py
```
Note that these models are related to the Python library defined as <Argos Translate>, and that once the models are downloaded they will be stored in the "/home/$USER/.local/" folder, where, inside from "share/" and "cache/" you can find related data.

![Argos Translate Data](https://github.com/CodeWithRodi/OpenDeyim/blob/main/Screenshots/Argos-Translate-Data.png?raw=true)

If you remove any of the folders identified as "argos-translate" from the above named and illustrated directories, the translation templates will be removed, so you will need to install them again.

To update the models, you only have to establish the "UpdateModels" argument when executing the server, which, as we saw previously in the table of available arguments for the server, should receive a Boolean value, in this case, if we assign it a True, this will update the available models if they are inside the Argos Translate servers.

```bash
# [/OpenDeyim/Server/]
python3 Main.py --UpdateModels True
```

## Considering external software
You should consider that OpenDeyim has certain pieces of code from the LibreTranslate backend, despite the fact that it was completely rewritten from scratch, eliminating a considerable number of functions to only be able to serve an API that allows solving the main objective, it has extracts from code of that software, so, as long as they are not removed from it, it is important to emphasize it. Please note, that OpenDeyim and LibreTranslate are by no means on a par in terms of versions, updates and implementations, as well as targets and other types of purposes, OpenDeyim is completely independent and does not claim in any way to match the standards of LibreTranslate.

OpenDeyim, uses the CodexDrake platform within its functionalities, this search engine allows interaction with the translations to be able to find sites on the Internet that are related or find images according to what the text says, likewise, it uses another type of dependencies to satisfy some of the most relevant features, such as React Speech Kit or ArgosTranslate by LibreTranslate.

## Let's talk about user experience and SEO
Inside the ReactJS application, that is, our front-end, we do NOT use Server-Side-Rendering, but consider that inside the <index.html> the corresponding tags are used to rank within search engines, your OpenDeyim instance eventually it will POSITION in Google or other search engines despite not doing Server-Side-Rendering.

Regarding the user experience, we have developed a user interface that is as intuitive as possible, following a relatively simple design accompanied by smooth and sophisticated animations that generate a much more enriched user experience when using our platform.

We know that the difference is in those sophisticated details, in which the client can notice the difference regarding the use in other platforms, not only in the nature in which OpenDeyim operates, but in general.

This software has been developed with the respective love and respect for the smallest detail that art has, implementing features that make the difference between other platforms.

## Open to contributions and updates
OpenDeyim is licensed under the MIT license; You can use the source code as you wish, both to study the operation of the software or to be able to replicate or improve this self-hosting platform for your own purposes. Consider that within the Github repository, it is completely open to contributions, changes and updates, in order to make it more efficient, or enrich the user experience with new features.
