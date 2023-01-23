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

export const MergeObjectValues = (To, From) => {
    for(const Value in From){
        if(typeof To[Value] != 'object')
            To[Value] = From[Value];
        else if(typeof From[Value] === 'object')
            To[Value] = MergeObjectValues(To[Value], From[Value]);
    }
    return To;
};