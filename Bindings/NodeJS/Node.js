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

const OpenDeyimAPI = require('./Binding');

(async function(){
    // ! Creating a new instance of the API implementation, as a 
    // ! parameter inside the class constructor, it receives 
    // ! the endpoint of your OpenDeyim self-hosted server, by 
    // ! default the server <opendeyim.codewithrodi.com> is assigned.
    const DeyimAPI = new OpenDeyimAPI('http://0.0.0.0:5000/api/v1');
    // ! When executing any of the methods that are defined 
    // ! within the class that are:
    // * -> Detect({ Query });
    // * -> Translate({ Query, Source, Target });
    // * -> Languages();
    // ! A promise is returned, for that reason we use try 
    // ! and catch blocks with the help of async.
    try{
        // ! Storing in a constant the detected language of the 
        // ! content that we send as a parameter to the <Detect> function.
        const LanguageDetection = await DeyimAPI.Detect({ Query: 'Hello world' });
        console.log('Language Detection ->', LanguageDetection.data);
        // ! Executing a translation of a content from one language to
        // ! another, in order to later be able to store it in a 
        // ! constant and continue to be displayed in the console.
        const Translation = await DeyimAPI.Translate({
            Query: 'Hola mundo desde la API de OpenDeyim utilizando NodeJS.',
            // * Note that as a defined parameter <Source>, we send 
            // * 'auto', by this we mean that depending on the content 
            // * to be translated that the server receives from our 
            // * client, it autodetects what language it is in and then 
            // * executes the translation to the defined language in <Target>.
            Source: 'auto',
            Target: 'en',
            // * Consider also that as the last parameter the translate method 
            // * receives an optional value, which corresponds to the variable 
            // * defined as <Format>, which can have two values, "text" or 
            // * "html", in case the value of this be "text", you are indicating 
            // * that the content you want to translate is merely content, while if 
            // * you indicate "html", you are indicating to the server that you are 
            // * sending html code to be translated, therefore, the return will be the 
            // * html code translated into the language that you have established.
            Format: 'text'
        });
        console.log('Translation ->', Translation.data);
        // * Note that the Translate method only has one mandatory 
        // * parameter, which is { Query }, whose value must contain the 
        // * content or text you want to translate, the other parameters 
        // * which are { Source, Target, Format } have the following values:
        // * -> Source = 'auto' :: Automatic language detection of the content that has { Query }
        // * -> Target = 'en' :: Based on the content sent in { Query }, if the value of <Target> 
        // *                     is not specified it will be translated by default to English.
        // * -> Format = 'text' :: The content that { Query } has will be text, in case it is 
        // *                     HTML, you must reassign the value of <Format>.
        // ! Obtaining all the available operative languages, where, we 
        // ! will obtain an array of objects where we will have 'Code' 
        // ! indicating the operative language together with 'Targets' 
        // ! that corresponds to another array with the available languages ​
        // ! ​with which the language that is in 'Code' can be set to run a translation.
        const AvailableLanguages = await DeyimAPI.Languages();
        console.log('Available Languages ->', AvailableLanguages.data);
    }catch(Error){
        console.log('An error has been ocurred:', Error);
    }
}());