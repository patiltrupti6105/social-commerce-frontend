import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Other',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Gray', 'Brown', 'Navy'];

export default function CreateProduct() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Step 1: Basic info
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });

  // Step 2: Variants
  const [variants, setVariants] = useState([
    { id: 1, size: '', color: '', stock: '' }
  ]);

  // Step 3: Images
  const [imageUrls, setImageUrls] = useState(['']);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(variants.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), size: '', color: '', stock: '' }]);
  };

  const removeVariant = (id) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrl = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageUrl = (index) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!basicInfo.title.trim()) newErrors.title = 'Title is required';
    if (!basicInfo.description.trim()) newErrors.description = 'Description is required';
    if (!basicInfo.price || parseFloat(basicInfo.price) <= 0) newErrors.price = 'Valid price is required';
    if (!basicInfo.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const hasValidVariant = variants.some(v => v.size && v.color && v.stock);
    if (!hasValidVariant) {
      setErrors({ variants: 'At least one complete variant is required' });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const validImages = imageUrls.filter(url => url.trim());
    const validVariants = variants.filter(v => v.size && v.color && v.stock);

    const productData = {
      name: basicInfo.title,
      description: basicInfo.description,
      price: parseFloat(basicInfo.price),
      category: basicInfo.category,
      variants: validVariants.map(v => ({
        size: v.size,
        color: v.color,
        stock: parseInt(v.stock),
      })),
      images: validImages,
      status: 'active',
    };

    try {
      await api.post('/seller/products', productData);
      navigate('/seller/dashboard');
    } catch (error) {
      // For demo, navigate anyway
      navigate('/seller/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Variants' },
    { number: 3, title: 'Images' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Product</h1>
        <p className="text-muted-foreground mt-1">Add a new product to your store</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`ml-3 font-medium hidden sm:block ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-1 mx-4 rounded ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={basicInfo.title}
              onChange={handleBasicInfoChange}
              className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.title ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Enter product title"
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={basicInfo.description}
              onChange={handleBasicInfoChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                errors.description ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Describe your product..."
            />
            {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  name="price"
                  value={basicInfo.price}
                  onChange={handleBasicInfoChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.price ? 'border-destructive' : 'border-input'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                name="category"
                value={basicInfo.category}
                onChange={handleBasicInfoChange}
                className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.category ? 'border-destructive' : 'border-input'
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Variants */}
      {currentStep === 2 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Product Variants</h2>
              <p className="text-sm text-muted-foreground">Add size, color, and stock for each variant</p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Variant
            </button>
          </div>

          {errors.variants && (
            <p className="mb-4 text-sm text-destructive">{errors.variants}</p>
          )}

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={variant.id} className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <span className="text-sm font-medium text-muted-foreground w-8">
                  #{index + 1}
                </span>

                <select
                  value={variant.size}
                  onChange={(e) => handleVariantChange(variant.id, 'size', e.target.value)}
                  className="flex-1 min-w-[120px] px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Size</option>
                  {SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>

                <select
                  value={variant.color}
                  onChange={(e) => handleVariantChange(variant.id, 'color', e.target.value)}
                  className="flex-1 min-w-[120px] px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Color</option>
                  {COLORS.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                  placeholder="Stock Qty"
                  min="0"
                  className="w-24 px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Images */}
      {currentStep === 3 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Product Images</h2>
            <p className="text-sm text-muted-foreground">Paste image URLs for your product (up to 5 images)</p>
          </div>

          <div className="space-y-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="p-3 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {imageUrls.length < 5 && (
              <button
                type="button"
                onClick={addImageUrl}
                className="text-sm text-primary hover:underline"
              >
                + Add another image URL
              </button>
            )}
          </div>

          {/* Image Previews */}
          {imageUrls.some(url => url.trim()) && (
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-3">Preview</p>
              <div className="flex flex-wrap gap-4">
                {imageUrls.filter(url => url.trim()).map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 rounded-xl object-cover bg-muted border border-border"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={currentStep === 1 ? () => navigate('/seller/dashboard') : prevStep}
          className="px-6 py-3 border border-input rounded-xl text-foreground hover:bg-muted transition-colors font-medium"
        >
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Product'}
          </button>
        )}
      </div>
    </div>
  );
}
