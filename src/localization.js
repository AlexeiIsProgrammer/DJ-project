import localization from './languages.json'

window.addEventListener('DOMContentLoaded', () => {
    const languages = document.querySelector('.languages')
    const languagesItems = languages.querySelectorAll('.languages__radio')
    let currentLang = 'eng'

    if (localStorage.getItem('site-language')) {
        const storageValue = localStorage.getItem('site-language')
        updateLanguage(storageValue)
        languages.querySelector(`.languages__radio[value="${storageValue}"]`).checked = true
    } else {
        updateLanguage(currentLang)
    }

    window.addEventListener('beforeunload', function () {
        localStorage.setItem('site-language', currentLang)
    })

    languagesItems.forEach(el => el.addEventListener('change', function (e) {
        updateLanguage(e.target.value)
    }))

    function updateLanguage(lang) {
        const neededLanguage = localization[lang]
        currentLang = lang
        Object.keys(neededLanguage).forEach(key => {
            document.querySelectorAll(`.${key}`).forEach(item => item.innerHTML = neededLanguage[key])
        })
    }
})