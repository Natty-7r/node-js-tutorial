const deleteBtns = document.querySelectorAll('.deleteProduct');
if (deleteBtns)
	deleteBtns.forEach((btn) =>
		btn.addEventListener('click', () => {
			console.log('clicked');
			const inputContainer = btn.closest('.inputs');
			const prodId = inputContainer.querySelector('[name = productId]').value;

			const csrf = inputContainer.querySelector('[name = _csrf]').value;
			fetch('/admin/products/' + prodId, {
				method: 'DELETE',
				headers: { 'csrf-token': csrf },
			})
				.then((result) => {
					return result.json();
				})
				.then((data) => {
					if (data.message == 'success') {
						const parent = btn.closest('.product-item');
						parent.remove();
					} else {
						console.error('error while deleting  product');
					}
				})
				.catch((err) => console.error(err));
		})
	);
 
