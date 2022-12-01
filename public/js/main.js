const backdrop = document.querySelector('.backdrop');
	const sideDrawer = document.querySelector('.mobile-nav');
	const menuToggle = document.querySelector('#side-menu-toggle');
	const inputs = document.querySelectorAll('input');
	const area = document.querySelectorAll('textarea');

	const signinForm = document.querySelector('.signinForm');
	const username = document.querySelector('.username');
	const logIn = document.querySelector('.logIn');
	const errorMassage = document.querySelector('.error-massage');

	if (!logIn.textContent.trim().includes('Login')) {
		const switchAccountEl = document.createElement('div');
		switchAccountEl.classList.add('switch-account');
		switchAccountEl.innerHTML = `<a href="/login"> Switch Account </a> <br /> <a href="/logout"> Logout </a>`;
		logIn.append(switchAccountEl);
		const switchAccount = document.querySelector('.switch-account');

		logIn.addEventListener('mouseover', () => {
			switchAccount.style.display = 'flex';
		});
		logIn.addEventListener('mouseleave', () => {
			switchAccount.style.display = 'none';
		});
	}

	inputs.forEach((input) => {
		input.addEventListener('focus', () => {
			input.select();
		});
	});

	area.forEach((input) => {
		input.addEventListener('focus', () => {
			input.select();
		});
	});

	function backdropClickHandler() {
		backdrop.style.display = 'none';
		sideDrawer.classList.remove('open');
	}

	function menuToggleClickHandler() {
		backdrop.style.display = 'block';
		sideDrawer.classList.add('open');
	}

	backdrop.addEventListener('click', backdropClickHandler);
	menuToggle.addEventListener('click', menuToggleClickHandler);
// }
// pagenation
{
	const pagenation = document.querySelector('.pagination');
	const addPageLink = function (pages, pageNumber, linkPath) {
		for (let index = 0; index < pages; index++) {
			const link = document.createElement('a');
			link.classList.add('pagelink', 'btn');
			if (pageNumber == index + 1) link.classList.add('active');

			if (Math.abs(pageNumber - (index + 1)) < 2)
				link.classList.add('nearlink');

			link.href = `${linkPath}?page=${index + 1}`;
			link.innerText = index + 1;
			pagenation.insertAdjacentElement('beforeend', link);
		}
	};

	if (pagenation) {
		const pages = Number.parseInt(
			document.querySelector('.pagesNum').textContent
		);
		const pageNumber = +document.querySelector('.pageNumber').textContent;
		const linkPath = document.querySelector('.linkpath').textContent;
		addPageLink(pages, pageNumber, linkPath);
	}
}