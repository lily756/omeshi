function taberu(id) {
    fetch('/taberu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
    })
        .then((response) => response.json())
        .then((data) => {
            //   console.log('Success:', data);
            if (data.err === '') {
                document.getElementById(id).disabled = true
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

let counter = []
let timeOutCounter = 0;
let audio = new Audio('/media/ティロリサウンド.mp3')

function setCounter(id, time) {
    let target = counter.findIndex(v => (v.id === id))
    if (target >= 0) {
        if (counter[target].timeOut) {//timeoutnotice off -> stop -> clean
            timeOutCounter -= 1
            if (counter[target].pause === true) {
                document.getElementById(counter[target].id).classList.remove('btn-danger')
                document.getElementById(counter[target].id).classList.add('btn-primary')
                let Hours = parseInt(counter[target].time / 3600)
                let Minuts = parseInt((counter[target].time - (Hours * 3600)) / 60)
                let Seconds = parseInt(counter[target].time - (Hours * 3600) - (Minuts * 60))
                let timerText = `计时器: ${Hours}:${Minuts}:${Seconds}`
                document.getElementById(counter[target].id).innerText = timerText
                // delete counter[target]
                counter.splice(target,1)
                return
            }
            // counter[target].timeOut = false
            counter[target].pause = true
            if (timeOutCounter <= 0) {
                audio.pause()
                audio.currentTime = 0
            }
        }else{
            counter[target].pause = !counter[target].pause
        }
    } else {
        counter.push({ second: parseInt(time), pause: false, id: id, timeOut: false, time: parseInt(time) })
    }
}

function updateCounter() {
    // console.log(counter)
    counter.map((v, i) => {
        // console.log(v)
        if (!v.pause) {
            counter[i].second -= 1
            let abs = false
            let second = v.second
            if (v.second < 0) {
                second = Math.abs(v.second)
                v.timeOut = true
                document.getElementById(v.id).classList.remove('btn-primary')
                document.getElementById(v.id).classList.add('btn-danger')
            }
            if (v.second === -1) {
                timeOutCounter += 1;
                audio.play()
            }
            let Hours = parseInt(second / 3600)
            let Minuts = parseInt((second - (Hours * 3600)) / 60)
            let Seconds = parseInt(second - (Hours * 3600) - (Minuts * 60))
            let timerText = `${v.timeOut ? '已超时' : '计时器'}: ${Hours}:${Minuts}:${parseInt(Seconds)}`
            document.getElementById(counter[i].id).innerText = timerText
        }
    })
}

setInterval(updateCounter, 1000);

function cocked(id){
    fetch('/done',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
    }).then((response) => response.json())
    .then((data) => {
        if (data.err === '') {
            document.getElementById(id).remove()
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}