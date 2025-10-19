// src/components/Cards.jsx
import React, { useState } from "react";
import { Card, Button, InputGroup, Form } from "react-bootstrap";

export default function Cards({
  title,
  description,
  image,
  buttonText = "Add to Cart",
  onAdd,                // (qty:number) => void
  min = 1,
  max = 99,
  initialQty = 1,
  price,
  stock,
  embedded = false,     // when true, render minimal controls only (for embedding in parent cards)
}) {
  const [qty, setQty] = useState(
    Math.min(Math.max(initialQty, min), max)
  );

  const dec = () => setQty(q => Math.max(q - 1, min));
  const inc = () => setQty(q => Math.min(q + 1, max));

  const onQtyInput = (e) => {
    const v = e.target.value.replace(/\D/g, ""); // digits only
    const n = v === "" ? "" : Number(v);
    if (v === "") setQty(min);
    else setQty(Math.min(Math.max(n, min), max));
  };

  const handleAdd = () => {
    if (typeof onAdd === "function") onAdd(qty);
  };

  return (
    <Card style={embedded ? cardStyles.containerEmbedded : cardStyles.container}>
      {!embedded && image && (
        <div style={cardStyles.imageContainer}>
          <Card.Img 
            variant="top" 
            src={image} 
            alt={title} 
            style={cardStyles.image}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <Card.Body style={embedded ? cardStyles.bodyEmbedded : cardStyles.body}>
        {!embedded && (
          <>
            <Card.Title style={cardStyles.title}>{title}</Card.Title>
            {price && (
              <div style={cardStyles.priceContainer}>
                <span style={cardStyles.price}>${price.toFixed(2)}</span>
                {stock !== undefined && (
                  <span style={cardStyles.stock}>
                    {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
            )}
            {description && (
              <Card.Text style={cardStyles.description}>{description}</Card.Text>
            )}
          </>
        )}

        {/* Quantity selector */}
        <InputGroup className="mb-3" style={cardStyles.quantityGroup}>
          <Button
            variant="outline-primary"
            onClick={dec}
            disabled={qty <= min}
            aria-label="Decrease quantity"
            style={cardStyles.quantityButton}
          >
            −
          </Button>
          <Form.Control
            value={qty}
            onChange={onQtyInput}
            inputMode="numeric"
            pattern="[0-9]*"
            className="text-center"
            aria-label="Quantity"
            style={cardStyles.quantityInput}
          />
          <Button
            variant="outline-primary"
            onClick={inc}
            disabled={qty >= max}
            aria-label="Increase quantity"
            style={cardStyles.quantityButton}
          >
            +
          </Button>
        </InputGroup>

        <div className="d-grid">
          <Button 
            variant="primary" 
            onClick={handleAdd}
            style={cardStyles.addButton}
            disabled={!stock || stock === 0}
          >
            {!stock || stock === 0 ? 'Out of Stock' : buttonText}
          </Button>
        </div>

        <div style={cardStyles.limits}>
          Min {min} • Max {max}
        </div>
      </Card.Body>
    </Card>
  );
}

const cardStyles = {
  container: {
    width: '22rem',
    margin: '1rem',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    overflow: 'hidden',
    position: 'relative',
  },
  containerEmbedded: {
    width: '100%',
    margin: 0,
    borderRadius: 0,
    border: 'none',
    boxShadow: 'none',
    background: 'transparent',
  },
  imageContainer: {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    height: '180px',
    width: '100%',
    objectFit: 'contain',
    transition: 'transform 0.3s ease',
  },
  body: {
    padding: '1.5rem',
    background: 'white',
  },
  bodyEmbedded: {
    padding: 0,
    background: 'transparent',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
    lineHeight: '1.4',
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  price: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#059669',
    background: 'linear-gradient(135deg, #059669, #10b981)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  stock: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
  },
  description: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '1rem',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
  },
  quantityGroup: {
    maxWidth: '220px',
    margin: '0 0 1rem 0',
  },
  quantityButton: {
    border: '2px solid #e2e8f0',
    background: '#f8fafc',
    color: '#475569',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  quantityInput: {
    border: '2px solid #e2e8f0',
    borderLeft: 'none',
    borderRight: 'none',
    fontWeight: '600',
    fontSize: '1rem',
  },
  addButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
  },
  limits: {
    color: '#94a3b8',
    fontSize: '0.75rem',
    textAlign: 'center',
    marginTop: '0.75rem',
    fontWeight: '500',
  },
};
