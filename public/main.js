function makeList (el, list) {
	el.innerHTML = ''
	list.forEach(function (item) {
		const li = document.createElement('li')
		const p = document.createElement('p')
		const a = document.createElement('a')
		a.href = item.link
		a.innerHTML = item.link
		a.target = '_blank'
		p.innerHTML = item.title
		li.appendChild(p)
		li.appendChild(a)
		li.className = 'list-group-item'
		el.appendChild(li)
	})
}

document.getElementById('submit').onclick = function (event) {
	event.preventDefault()
	fetch('/search', {
		method: 'POST',
		mode: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text: document.getElementById('text').value
		})
	})
		.then((res) => res.json())
		.then((res) => {
			console.log(res)
			makeList(document.getElementById('list'), res)
		})
}
