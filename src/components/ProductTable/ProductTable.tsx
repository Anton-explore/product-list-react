import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, toggleSelect, deleteSelected, startEditing, saveEdit, Product, setLimit, setSkip } from '../../store/slices/productsSlice';
import { RootState, AppDispatch } from '../../store/store';
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Loader from '../Loader/Loader';
import './ProductTable.css';

const ProductTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.items);
  const status = useSelector((state: RootState) => state.products.status);
  const selectedItems = useSelector((state: RootState) => state.products.selectedItems);
  const [editData, setEditData] = useState<Record<number, Partial<Product>>>({});
  const limit = useSelector((state: RootState) => state.products.limit);
  const skip = useSelector((state: RootState) => state.products.skip);

  useEffect(() => {
    dispatch(fetchProducts({ limit, skip }));
  }, [dispatch, limit, skip]);

  const handleCheckboxChange = (id: number) => {
    dispatch(toggleSelect(id));
  };

  const handleDeleteSelected = () => {
    dispatch(deleteSelected());
  };

  const handleStartEditing = (id: number) => {
    dispatch(startEditing(id));
    setEditData((prev) => ({ ...prev, [id]: products.find((item) => item.id === id) || {} }));
  };

  const handleEditChange = (id: number, field: keyof Product, value: string | number) => {
    setEditData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveEdit = (id: number) => {
    dispatch(saveEdit({ id, updatedData: editData[id] }));
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = parseInt(event.target.value as string, 10);
    dispatch(setLimit(newLimit));
    dispatch(setSkip(0));
  };

  const handleNextPage = () => {
    dispatch(setSkip(skip + limit));
  };

  const handlePreviousPage = () => {
    dispatch(setSkip(Math.max(skip - limit, 0)));
  };

  if (status === 'loading') return (<Loader />);
  if (status === 'failed') return (<p className='message'>Failed to load product list. Please check internet connection</p>);
  if (products.length == 0) return ( <p className='message'>There is no products</p> )

  return (
    <div className='container'>
      <TableContainer component={Paper}>
        <Button
          className='btn-delete'
          variant="contained"
          color="secondary"
          onClick={handleDeleteSelected}
          disabled={selectedItems.length === 0}
        >
          Delete Selected
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </TableCell>
                <TableCell style={{ fontSize: '18px'}}>
                  <img
                    src={product.images[0]}
                    alt="Product image"
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '10px',
                      borderRadius: '5px',
                      objectFit: 'cover',
                    }}
                  />
                  {product.isEditing ? (
                    <TextField
                      value={editData[product.id]?.title || product.title}
                      onChange={(e) => handleEditChange(product.id, 'title', e.target.value)}
                    />
                  ) : (
                    product.title
                  )}
                </TableCell>
                <TableCell>
                  {product.isEditing ? (
                    <TextField
                      type="number"
                      value={editData[product.id]?.rating || product.rating}
                      onChange={(e) => handleEditChange(product.id, 'rating', +e.target.value)}
                    />
                  ) : (
                    product.rating
                  )}
                </TableCell>
                <TableCell>
                  {product.isEditing ? (
                    <TextField
                      type="string"
                      value={editData[product.id]?.availabilityStatus || product.availabilityStatus}
                      onChange={(e) => handleEditChange(product.id, 'availabilityStatus', e.target.value)}
                    />
                  ) : (
                    product.availabilityStatus
                  )}
                </TableCell>
                <TableCell>
                  {product.isEditing ? (
                    <TextField
                      type="number"
                      value={editData[product.id]?.price || product.price}
                      onChange={(e) => handleEditChange(product.id, 'price', +e.target.value)}
                    />
                  ) : (
                    `${product.price} $`
                  )}
                </TableCell>
                <TableCell>
                  {product.isEditing ? (
                    <Button variant="contained" onClick={() => handleSaveEdit(product.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={() => handleStartEditing(product.id)}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
        <Button variant="contained" onClick={handlePreviousPage} disabled={skip === 0}>
          Previous
        </Button>
        <span style={{ margin: '0 16px' }}>Page {skip / limit}</span>
        <Button variant="contained" onClick={handleNextPage}>
          Next
        </Button>

        <div style={{ marginLeft: '16px' }}>
          <Select value={limit} onChange={handleLimitChange}>
            {[10, 20, 30, 40, 50].map((value) => (
              <MenuItem key={value} value={value}>
                {value} per page
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
