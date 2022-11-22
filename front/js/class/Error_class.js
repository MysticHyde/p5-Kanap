export class Error {

    async Redirection(link) {

        let new_link = link + '/index.html';
        window.location.replace(new_link);
    }

    Notification(err) {

        let error_container = document.createElement('div');
        error_container.setAttribute('class', 'errorContainer')
        let error_content = document.createElement('div');
        error_content.setAttribute('class', 'errorContent')
        switch (typeof err) {
            case 'string':

                let error_text = document.createElement('p');
                error_text.textContent = err;
                error_content.appendChild(error_text)

                break;
            case 'object':

                console.log('obj')

                break;
            case 'array':

                console.log('arr')

                break;
        }
        error_container.appendChild(error_content);
        let body = document.querySelector('body');
        body.appendChild(error_container)
        error_container.scrollIntoView();
        setInterval(() => {
            error_container.remove()
        }, 2500);
    }
}