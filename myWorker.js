onmessage = function (e) {
    searchTerm = e.data;
    navigator.serviceWorker.register('/PWA_A03/serviceWorker.js',
        { scope: '/PWA_A03/' });



    importScripts("movieObj.js");
}

function processFilms(data) {
    console.log(data)
    try {
        if (data.offline == true) {
            messageObj = {
                checkedFilms: 0,
                filmScriptObjFormatted: null,
                totalFilms: 0,
                offline: true

            }
        }
        postMessage(messageObj)

    }
    catch {
        var checkedFilms = 0
        var filmScriptArray = Object.keys(data).map(key => {
            return data[key];
        })
        var totalFilms = filmScriptArray.length

        for (const filmScriptObj of filmScriptArray) {
            checkedFilms++
            messageObj = {
                checkedFilms: checkedFilms,
                filmScriptObjFormatted: null,
                totalFilms: totalFilms
            }



            //  console.log(checkedFilms, '/', filmScriptArray.length)
            if (filmScriptObj.title.toUpperCase().includes(searchTerm.toUpperCase())) {



                var regex = new RegExp(searchTerm, 'ig');
                titleMarked = filmScriptObj.title.replace(regex, '<mark>$&</mark>');
                let filmScriptObjFormatted = { title: titleMarked, URL: filmScriptObj.link }
                messageObj.filmScriptObjFormatted = filmScriptObjFormatted

            }
            postMessage(messageObj)

        }
        filmScriptArray = []

    }
}
