const Layout = require('./layout');

<Layout>
  <form action="" method="get">
    <input name="search" placeholder="Search title, description" value={search} />
  </form>
  <br />
  {items.map(({ id, title, description, images, user }) => (
    <div key={id}>
      <h4>{title}</h4>
      <p>{description}</p>
      <strong>
        Liên hệ: {user.full_name} ({user.phone})
      </strong>
      <br />
      {images.length && <img src={images[0].image} />}
      <hr />
    </div>
  ))}
</Layout>;
