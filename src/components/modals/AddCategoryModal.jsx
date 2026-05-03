import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalHeader, ModalTitle, ModalCloseButton, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select, SelectItem } from '../ui/Select';
import { categorySchema } from '../../utils/validators';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ICONS = ['🍽️', '🛍️', '🚗', '💡', '🎬', '🏥', '📚', '📦', '💼', '💻', '📈', '🎁', '💰', '🎯', '🏠', '✈️'];
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];

const AddCategoryModal = ({ isOpen, onClose, onSuccess, editCategory }) => {
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: '',
      color: '',
      type: 'expense'
    }
  });

  const categoryType = watch('type');

  useEffect(() => {
    if (isOpen) {
      if (editCategory) {
        setValue('name', editCategory.name);
        setValue('icon', editCategory.icon);
        setValue('color', editCategory.color);
        setValue('type', editCategory.type);
        setSelectedIcon(editCategory.icon);
        setSelectedColor(editCategory.color);
      } else {
        reset();
        setSelectedIcon('');
        setSelectedColor('');
      }
    }
  }, [isOpen, editCategory, setValue, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editCategory) {
        await api.updateCategory(editCategory._id, data);
        toast.success('Category updated successfully');
      } else {
        await api.createCategory(data);
        toast.success('Category added successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <ModalHeader>
        <ModalTitle>
          {editCategory ? 'Edit Category' : 'Add Category'}
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
                value={categoryType}
                onValueChange={(value) => setValue('type', value)}
                placeholder="Select type"
              >
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Category name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <div className="grid grid-cols-8 gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(icon);
                      setValue('icon', icon);
                    }}
                    className={`p-2 border rounded-md hover:bg-accent transition-colors ${
                      selectedIcon === icon ? 'border-primary bg-accent' : 'border-input'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              {errors.icon && (
                <p className="text-sm text-destructive mt-1">{errors.icon.message}</p>
              )}
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="grid grid-cols-8 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setValue('color', color);
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-primary' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="text-sm text-destructive mt-1">{errors.color.message}</p>
              )}
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (editCategory ? 'Update' : 'Add')}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;