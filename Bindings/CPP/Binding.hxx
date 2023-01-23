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
 
#include <vector>
#include <optional>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

size_t CurlWriteBackFunction(void *Contents, size_t Size, size_t NMEMB, std::string *S){
    size_t Length = Size * NMEMB;
    S->append((char*) Contents, Length);
    return Length;
}

std::string CurlPost(std::string URL, std::vector<std::string> Headers, std::string PostFields){
    std::string ToReturn;
    CURL *Curl;
    curl_global_init(CURL_GLOBAL_ALL);
    Curl = curl_easy_init();
    if(Curl){
        curl_easy_setopt(Curl, CURLOPT_URL, URL.c_str());
        curl_easy_setopt(Curl, CURLOPT_POSTFIELDS, PostFields.c_str());
        curl_easy_setopt(Curl, CURLOPT_USE_SSL, CURLUSESSL_ALL);
        curl_easy_setopt(Curl, CURLOPT_SSL_VERIFYPEER, true);
        struct curl_slist *HeadersSLIST = NULL;
        if(Headers.size() > 0){
            for(std::string Header : Headers)
                HeadersSLIST = curl_slist_append(HeadersSLIST, Header.c_str());
            curl_easy_setopt(Curl, CURLOPT_HTTPHEADER, HeadersSLIST);
        }
        curl_easy_setopt(Curl, CURLOPT_WRITEFUNCTION, CurlWriteBackFunction);
        curl_easy_setopt(Curl, CURLOPT_WRITEDATA, &ToReturn);
        CURLcode Response;
        Response = curl_easy_perform(Curl);
        if(Response != CURLE_OK)
            throw curl_easy_strerror(Response);
        if(HeadersSLIST)
            curl_slist_free_all(HeadersSLIST);
        curl_easy_cleanup(Curl);
    }
    curl_global_cleanup();
    return ToReturn;
}

json JSONPost(std::string URL, json Data){
    std::vector<std::string> Headers;
    Headers.push_back("Content-Type: application/json");
    std::string SerializedJSON = Data.dump();
    std::string Response = CurlPost(URL, Headers, SerializedJSON);
    return json::parse(Response);
}

class OpenDeyimAPI{
    private:
        std::string BaseURL;

    public:
        OpenDeyimAPI(std::string LBaseURL = "deyimapi.codewithrodi.com") : BaseURL(LBaseURL){}

        json Translate(std::string Query, std::string Source = "auto", std::string Target = "en", std::string Format = "text"){
            std::string URL = BaseURL + "/translate";
            json Request;
            Request["Query"] = Query;
            Request["Source"] = Source;
            Request["Target"] = Target;
            Request["Format"] = Format;
            json Response = JSONPost(URL, Request);
            return Response;
        }
        
        json Languages(){
            std::string URL = BaseURL + "/languages";
            json Request;
            json Response = JSONPost(URL, Request);
            return Response;
        }

        json Detect(std::string Query){
            std::string URL = BaseURL + "/detect";
            json Request;
            Request["Query"] = Query;
            json Response = JSONPost(URL, Request);
            return Response;
        }
};
