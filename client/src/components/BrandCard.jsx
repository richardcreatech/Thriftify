

function BrandCard({ brand }) {
  return (
    <div className="brand-card">
      <div className="brand-card__header">
        <div
          className="brand-card__logo"
          style={{
            background: brand.accent + "22",
            border: `1.5px solid ${brand.accent}44`,
          }}
        >
          <img src={brand.logo} alt={brand.name} />
        </div>
        <span className="brand-card__name">{brand.name}</span>
      </div>
      <p className="brand-card__desc">{brand.description}</p>
    </div>
  );
}


export default BrandCard
