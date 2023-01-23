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
# * (www.github.com/codewithrodi/OpenDeyim/)
# * 
# * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
# * Full Stack Software Developer.
# *
# * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 
# ! By importing the official implementation of the 
# ! API, you can copy that file and use it in your projects 
# ! so that you can integrate your OpenDeyim instance inside Python.
from Binding import OpenDeyimAPI

# ! Creating an instance of the class, where it receives as 
# ! a parameter in its '__init__' the URL of the OpenDeyim 
# ! server, which can be your self-hosted instance.
DeyimAPI = OpenDeyimAPI('http://0.0.0.0:5000/api/v1')

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
