class HappySliderView extends Backbone.View
    events:
        'click .js-slider-arrow': 'arrowClick'

    initialize: ->
        $(window).bind 'resize', _.throttle(@reinitialize)
        @listenTo HappySliderEvents, 'actiontimer:started', @slideToActive

        @$items = @$ '.b-happy-hours__slider-item'
        @$nextArrow = @$el.find '.js-slider-arrow[data-direction="1"]'
        @$prevArrow = @$el.find '.js-slider-arrow[data-direction="-1"]'

        
        # @itemWidth = @$items.outerWidth true
        # @activeItemWidth = @itemWidth + 170
        # @itemsCount = @$items.length

        @sliderTrack = @$ '.js-slider-track'
        # @sliderWidth = @$el.outerWidth true
        # @trackWidth = 170 + _.reduce @$items, (sum, item)->
        #     sum + $(item).outerWidth true
        # , 0

        @currOffset = 0

        @sliderTrack.css 'width', "#{@trackWidth}px"

        @$items.each (key, $item)=>
            timerModel = new HappyTimerModel
                startTime: @parseTimeAttr($item.dataset.starttime)
                endTime: @parseTimeAttr($item.dataset.endtime)

            timerView = new HappySliderItemView
                el: $item
                model: timerModel

        if !@$itemActive or !@$itemActive.length
            currentItem = @$items.filter '.b-happy-hours__slider-item--current'
            if currentItem.length
                @$items.attr 'data-status', ''
                @$itemActive = currentItem
                @$itemActive.attr 'data-status', 'active'

        if !@$itemActive or !@$itemActive.length
            @$itemActive = @$ '[data-status="active"]'

        if !@$itemActive or !@$itemActive.length
            @$items.attr 'data-status', ''
            @$itemActive = @$items.eq Math.ceil(@itemsCount / 2)
            @$itemActive.attr 'data-status', 'active'

        @reinitialize()

        _.delay =>
            @$el.addClass 'b-happy-hours__slider--inited'
        , 100

    reinitialize: =>
        @itemsCount = @$items.length
        @itemWidth = 340
        @activeItemWidth = @itemWidth + 170
        @sliderWidth = @$el.outerWidth true          
        @trackWidth = 170 + @itemWidth * @itemsCount
        @sliderTrack.css 'width', "#{@trackWidth}px"
        @arrowsCheckState()
        @slideToActive()

    parseTimeAttr: (str)->
        dt = new Date()
        t = str.split ':'
        dt.setSeconds t[2]
        dt.setMinutes t[1]
        dt.setHours t[0]
        return dt

    arrowClick: (event)=>
        # @$itemActive = @$ '.b-happy-hours__slider-item[data-status="active"]'
        @$items.attr 'data-status', ''

        if parseInt(event.currentTarget.getAttribute 'data-direction') > 0
            @$itemActive = @$itemActive.next()
        else
            @$itemActive = @$itemActive.prev()

        if @$itemActive && @$itemActive.length
            @$itemActive.attr 'data-status', 'active'

        @arrowsCheckState()
        @slideToActive()

    slideToActive: =>
        @$itemActive = @$ '.b-happy-hours__slider-item[data-status="active"]'
        translate = "translateX(#{ -1 * ((@$itemActive.index() * @itemWidth + @activeItemWidth / 2) - @sliderWidth / 2) }px)"
        @sliderTrack.css
            '-webkit-transform': translate
            '-moz-transform': translate
            '-ms-transform': translate
            '-o-transform': translate
            'transform': translate

    arrowsCheckState: =>
        if @$itemActive.index() <= 0 then @$prevArrow.hide()
        else @$prevArrow.show()

        if @$itemActive.index() >= @itemsCount - 1 then @$nextArrow.hide()
        else @$nextArrow.show()