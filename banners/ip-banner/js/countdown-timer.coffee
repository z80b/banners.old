class CountdownTimer

    constructor: (_selector, _title, _options)->

        @options = _options ||
            days:    'дд'
            hours:   'чч'
            minutes: 'мм'
            seconds: 'сс'
        @$timer = document.querySelector _selector
        @$timerContent = document.querySelector '.js-timer-content'
        @$countTpl = @$timer.querySelector '#timer-count-tpl'
        @endDate = new Date @$timer.getAttribute('data-final-date')
        @render()

    render: ()->
        html = ''
        for name, title of @options
            html += @$countTpl.innerText
                .replace '%name%', name
                .replace '%title%', title
        @$timerContent.innerHTML = html

    getCount: (_countName)=>
        nowDate = new Date
        totalSecsLeft = if @endDate.getTime() > nowDate.getTime() then (@endDate.getTime() - nowDate.getTime()) / 1e3 else 0
        count = switch _countName
            when 'seconds' then Math.floor totalSecsLeft % 60
            when 'minutes' then Math.floor(totalSecsLeft / 60) % 60
            when 'hours'   then Math.floor(totalSecsLeft / 60 / 60) % 24
            when 'days'    then Math.floor(totalSecsLeft / 60 / 60 / 24)
        if count < 10 then return "0#{count}" else return String count

    update: ()=>
    
        removeClass = ($items, className) ->
            for $item in $items
                $item.classList.remove className

        addClass = ($items, className) ->
            for $item in $items
                $item.classList.add className

        for name, title of @options
            $count = @$timer.querySelector ".js-timer-count--#{name}"
            $parts = $count.querySelectorAll ".js-timer-count__part"
            removeClass $parts, 'flip'

            value = @getCount(name)

            $parts[0].children[0].setAttribute('data-current', $parts[0].children[0].getAttribute('data-next'))
            $parts[0].children[1].setAttribute('data-current', $parts[0].children[0].getAttribute('data-next'))
            $parts[1].children[0].setAttribute('data-current', $parts[1].children[0].getAttribute('data-next'))
            $parts[1].children[1].setAttribute('data-current', $parts[1].children[0].getAttribute('data-next'))
            $parts[0].children[0].setAttribute('data-next', value[0])
            $parts[0].children[1].setAttribute('data-next', value[0])
            $parts[1].children[0].setAttribute('data-next', value[1])
            $parts[1].children[1].setAttribute('data-next', value[1])

            if parseInt($parts[0].children[0].getAttribute('data-current')) != parseInt($parts[0].children[0].getAttribute('data-next'))
                $parts[0].className += ' js-changed'

            if parseInt($parts[1].children[0].getAttribute('data-current')) != parseInt($parts[1].children[0].getAttribute('data-next'))
                $parts[1].className += ' js-changed'

            setTimeout () =>
                $changed = @$timer.querySelectorAll '.js-changed'
                removeClass $changed, 'js-changed'
                addClass $changed, 'flip'
            , 50

    start: -> 
        setTimeout =>
            @update()
            @start()
        , 1000
