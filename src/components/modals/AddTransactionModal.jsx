import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalHeader, ModalTitle, ModalCloseButton, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select, SelectItem } from '../ui/Select';
import { transactionSchema } from '../../utils/validators';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddTransactionModal = ({ isOpen, onClose, onSuccess, editTransaction }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      category: '',
      date: new Date(),
      note: ''
    }
  });

  const transactionType = watch('type');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (editTransaction) {
        setValue('type', editTransaction.type);
        setValue('amount', editTransaction.amount);
        setValue('category', editTransaction.category);
        setValue('date', new Date(editTransaction.date));
        setValue('note', editTransaction.note);
        setSelectedCategory(editTransaction.category);
      } else {
        reset();
        setSelectedCategory('');
      }
    }
  }, [isOpen, editTransaction, setValue, reset]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === transactionType);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editTransaction) {
        await api.updateTransaction(editTransaction._id, data);
        toast.success('Transaction updated successfully');
      } else {
        await api.createTransaction(data);
        toast.success('Transaction added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <ModalHeader>
        <ModalTitle>
          {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                value={transactionType}
                onValueChange={(value) => {
                  setValue('type', value);
                  setSelectedCategory('');
                  setValue('category', '');
                }}
                placeholder="Select type"
              >
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setValue('category', value);
                }}
                placeholder="Select category"
              >
                {filteredCategories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <DatePicker
                selected={watch('date')}
                onChange={(date) => setValue('date', date)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                dateFormat="MMM dd, yyyy"
              />
              {errors.date && (
                <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium mb-1">Note (Optional)</label>
              <textarea
                {...register('note')}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
                placeholder="Add a note..."
              />
              {errors.note && (
                <p className="text-sm text-destructive mt-1">{errors.note.message}</p>
              )}
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editTransaction ? 'Update' : 'Add')}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;