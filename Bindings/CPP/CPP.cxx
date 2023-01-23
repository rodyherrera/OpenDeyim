/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * The OpenDeyim Source Code
 * A free, modern, self-hosted and open source translation service that instantly 
 * translates phrases, words and web pages into more than 30 languages. Use our 
 * API or bindings and experiment with OpenDeyim.
 * 
 * For more information, please read the documentation inside 
 * the <README.md> file which is located at the root of this directory or source code.
 * 
 * (www.github.com/codewithrodi/OpenDeyim/)
 * 
 * Rodolfo Herrera Hernandez <contact@codewithrodi.com>.
 * Full Stack Software Developer.
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
 
/*
    ! sudo apt-get install -y libcurl4-openssl-dev
    ! curl-config --libs
    ! sudo apt-get install nlohmann-json3-dev
    ! = repository ppa:team-xbmc/ppa
*/
#include <iostream>
#include "Binding.hxx"

int main(){
    // ! Creating a new instance to start interacting with our 
    // ! OpenDeyim self hosted server. The address of our server 
    // ! must be sent as a parameter to the constructor, otherwise 
    // ! the default server will be used.
    OpenDeyimAPI DeyimAPI("http://0.0.0.0:5000/api/v1");
    // ! Showing in the console the detected language of 
    // ! the content sent through the function.
    std::cout << DeyimAPI.Detect("Hello world") << std::endl;
    // TODO: std::cout << DeyimAPI.Languages() << std::endl;
    // ! Executing the translation of a content from one 
    // ! language to another, to then be able to display it on the screen.
    // * Note that as a defined parameter <Source>, we send 
    // * 'auto', by this we mean that depending on the content 
    // * to be translated that the server receives from our 
    // * client, it autodetects what language it is in and then 
    // * executes the translation to the defined language in <Target>.
    // * Consider also that as the last parameter the translate method 
    // * receives an optional value, which corresponds to the variable 
    // * defined as <Format>, which can have two values, "text" or 
    // * "html", in case the value of this be "text", you are indicating 
    // * that the content you want to translate is merely content, while if 
    // * you indicate "html", you are indicating to the server that you are 
    // * sending html code to be translated, therefore, the return will be the 
    // * html code translated into the language that you have established.
    std::cout << "Translating 'Hello world!' to Spanish..." << std::endl;
    std::cout << DeyimAPI.Translate("Hello world!", "auto", "es", "text") << std::endl;
    // * Note that the Translate method only has one mandatory 
    // * parameter, which is { Query }, whose value must contain the 
    // * content or text you want to translate, the other parameters 
    // * which are { Source, Target, Format } have the following values:
    // * -> Source = 'auto' :: Automatic language detection of the content that has { Query }
    // * -> Target = 'en' :: Based on the content sent in { Query }, if the value of <Target> 
    // *                     is not specified it will be translated by default to English.
    // * -> Format = 'text' :: The content that { Query } has will be text, in case it is 
    // *                     HTML, you must reassign the value of <Format>.
    return 0;
}
