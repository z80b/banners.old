#=include countdown-timer.coffee
window.onload = ->
	window.countdownTimer = new CountdownTimer '.js-timer', 'До акции осталось'
	window.countdownTimer.start()