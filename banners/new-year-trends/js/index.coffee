window.onload = ()->
    CONTAINER_ELEMENT = document.querySelector '.new-year-trends__body.js-new-year-trends .new-year-trends__link'
    WIDTH = CONTAINER_ELEMENT.clientWidth
    HEIGHT = CONTAINER_ELEMENT.clientHeight
    CANVAS_CLASSNAME = 'new-year-trends__canvas'

    console.log WIDTH, HEIGHT

    createCanvas = (parent, width, height)->
        canvas = {}
        canvas.node = document.createElement 'canvas'
        canvas.node.className = CANVAS_CLASSNAME
        canvas.context = canvas.node.getContext '2d'
        canvas.node.width = width || 100
        canvas.node.height = height || 100
        parent.appendChild canvas.node
        return canvas

    init = (container, width, height, color, img, brushRadius)->
        canvas = createCanvas container, width, height
        ctx = canvas.context

        ctx.draw = (x, y, radius)->
            this.lineWidth = radius
            this.lineCap = ctx.lineJoin = 'round'
            this.strokeStyle = '#f00'
            @lineTo x, y
            @stroke()

        ctx.startDraw = (x, y, radius, container)->
            @beginPath();
            @moveTo x + 0.01, y

        ctx.clearTo = (color, img, width, height)->
            if color
                this.fillStyle = color
                this.fillRect 0, 0, width, height
            else
                overlay = new Image()
                overlay.src = img
                overlay.onload = ()->
                    ctx.fillStyle = ctx.createPattern overlay, 'no-repeat'
                    ctx.rect 0, 0, width, height
                    ctx.fill()


        ctx.clearTo color, img, width, height

        canvas.node.onmouseenter = (e)->
            x = e.offsetX - @offsetLeft;
            y = e.offsetY - @offsetTop;

            ctx.globalCompositeOperation = 'destination-out'
            ctx.startDraw x, y, brushRadius, container

        canvas.node.onmousemove = (e)->
            x = e.offsetX - @offsetLeft
            y = e.offsetY - @offsetTop
            ctx.globalCompositeOperation = 'destination-out'
            ctx.draw x, y, brushRadius

    #for container in CONTAINER_ELEMENT
    init CONTAINER_ELEMENT, WIDTH, HEIGHT, CONTAINER_ELEMENT.dataset.color, CONTAINER_ELEMENT.dataset.overlay, CONTAINER_ELEMENT.dataset.radius
