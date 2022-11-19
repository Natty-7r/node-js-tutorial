const createProduct = () => {
	const productElemnet = ` <article class="card product-item">
	<header class="card__header">
		<h1 class="product__title">
			<%= product.title %>
		</h1>
	</header>
	<div class="card__image">
		<img src="<%= product.imgUrl %>" alt="<%= product.title %>">
	</div>
	<div class="card__content">
		<h2 class="product__price">$
			<%= product.price %>
		</h2>
		<p class="product__description">
			<%= product.description %>
		</p>
	</div>
	<div class="card__actions">
		<a href="/products/<%=product.id%>" class="btn">Detail</a>
		<!-- <a href="/products?id=<%=product.id%>" class="btn">Detail</a> -->
		<% if(authentication){%>
		<%- include('../includes/addToCart.ejs',{product:product})%>
		<%}%>
	</div>
	

</article>`;
};
const updateProducts = () => {};

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
						console.error('error while deteling product');
					}
				})
				.catch((err) => console.error(err));
		})
	);
