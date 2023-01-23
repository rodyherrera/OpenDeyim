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

import Axios from '../Patches/Axios';
import Infrastructure from '../Infrastructure';

export const MakeServerRequest = async ({
    Callback = undefined,
    Arguments = undefined
}) => new Promise(async (Resolve, Reject) => {
    try{
        const Response = (await Callback(...(Arguments || []))).data;
        if(Response.Status !== 'Success')
            throw new Error(Response.Message);
        Resolve(Response);
    }catch(Rejection){
        Reject(Rejection);
    }
    return Response;
});

export const GenericRequestToBackend = ({
    Path,
    Method = 'GET',
    Body = {}
}) => {
    (Path.endsWith('/') && (Path = Path.slice(0, Path.length - 1)))
    const Arguments = [`${Infrastructure.Server}/${Path}`];
    Method = Method.toLowerCase();
    if(['post', 'put', 'patch'].includes(Method))
        Arguments.push(Body);
    return Axios[Method](...Arguments);
};

export const SetPageTitle = (Title) => 
    document.title = Title + ' - OpenDeyim, Modern Open Source Translation Software';

export const GetClientLanguage = () => navigator.language.split('-')[0];

export const CopyToClipboard = (Content) => {
    const TextArea = document.createElement('textarea');
    const IsiOS = navigator.userAgent.match(/ipad|iphone/i);
    TextArea.value = Content;
    TextArea.style.position = 'absolute';
    TextArea.style.left = '-9999px';
    TextArea.setAttribute('readonly', '');
    document.body.appendChild(TextArea);

    if(IsiOS){
        const Range = document.createRange();
        Range.selectNodeContents(TextArea);
        const Selection = window.getSelection();
        Selection.removeAllRanges();
        Selection.addRange(Range);
        TextArea.setSelectionRange(0, Content.length);
    }else{
        TextArea.select();
    }

    try{
        return document.execCommand('copy');
    }catch(CopyError){
        return false;
    }finally{
        document.body.removeChild(TextArea);
    }
};