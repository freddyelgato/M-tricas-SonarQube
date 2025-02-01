import React from 'react';

const ProductActions = ({ product, onDelete, onEdit }) => {
  return (
    <div>
      <button onClick={() => onEdit(product)}>Edit</button>
      <button onClick={() => onDelete(product._id)}>Delete</button> 
    </div>
  );
};


export default ProductActions;
