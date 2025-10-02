# VibeVault Glassmorphism Design System

## Color Palette

### Primary Colors
```
Background Dark:    #0a0e1a
Background Light:   #0f1419
Accent Primary:     #6366f1 (Indigo)
Accent Light:       #818cf8
Accent Hover:       #4f46e5
```

### Glass Effects
```
Glass Background:        rgba(15, 20, 25, 0.7)
Glass Background Light:  rgba(20, 25, 35, 0.6)
Glass Background Strong: rgba(15, 20, 25, 0.85)
Glass Border:            rgba(255, 255, 255, 0.1)
Glass Border Strong:     rgba(255, 255, 255, 0.15)
Glass Highlight:         rgba(255, 255, 255, 0.05)
```

### Text Colors
```
Primary:    #e2e8f0
Secondary:  #94a3b8
Tertiary:   #64748b
Inactive:   #475569
```

### Status Colors
```
Success:  #10b981
Error:    #ef4444
Warning:  #f59e0b
Info:     #3b82f6
```

## Typography

### Font Family
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
sans-serif
```

### Font Sizes
```
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.75rem (28px)
h4: 1.5rem (24px)
h5: 1.25rem (20px)
h6: 1.125rem (18px)
body1: 1rem (16px)
body2: 0.875rem (14px)
caption: 0.75rem (12px)
```

## Spacing System
```
xs:   4px
sm:   8px
md:   16px
lg:   24px
xl:   32px
xxl:  48px
xxxl: 64px
```

## Border Radius
```
Small:    8px
Medium:   16px
Large:    24px
```

## Shadows

### Card Shadows
```css
/* Default */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;

/* Hover */
box-shadow: 0 12px 48px rgba(99, 102, 241, 0.25), 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
```

### Button Shadows
```css
/* Default */
box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);

/* Hover */
box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
```

### Modal Shadows
```css
box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
```

## Glassmorphism Components

### Card Component
```css
background-color: rgba(20, 25, 35, 0.6);
backdrop-filter: blur(16px) saturate(180%);
-webkit-backdrop-filter: blur(16px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
            0 0 0 1px rgba(255, 255, 255, 0.05) inset;
```

### Button Component
```css
background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
```

### Input Component
```css
background-color: rgba(15, 20, 25, 0.6);
backdrop-filter: blur(12px) saturate(180%);
-webkit-backdrop-filter: blur(12px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 8px;
```

### Modal/Dialog Component
```css
background-color: rgba(15, 20, 25, 0.85);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
```

## Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
```

### Success Gradient
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Error Gradient
```css
background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
```

### Warning Gradient
```css
background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

### Background Gradient
```css
background: linear-gradient(135deg, #0a0e1a 0%, #050810 50%, #0a0e1a 100%);
```

## Animations

### Transition Timings
```css
/* Shortest */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Shorter */
transition: all 200ms cubic-bezier(0.0, 0, 0.2, 1);

/* Standard */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Complex */
transition: all 375ms cubic-bezier(0.4, 0, 0.6, 1);
```

### Hover Effects
```css
/* Card Hover */
transform: translateY(-8px);
box-shadow: 0 12px 48px rgba(99, 102, 241, 0.25);

/* Button Hover */
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
```

### Focus Effects
```css
border-color: #6366f1;
box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
```

## Interactive States

### Default State
```css
opacity: 1;
transform: scale(1);
```

### Hover State
```css
opacity: 1;
transform: scale(1.02) translateY(-2px);
```

### Active/Pressed State
```css
opacity: 0.9;
transform: scale(0.98);
```

### Disabled State
```css
opacity: 0.5;
cursor: not-allowed;
background: rgba(71, 85, 105, 0.3);
```

## Scrollbar Styling
```css
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 20, 25, 0.3);
  backdrop-filter: blur(8px);
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.4);
  border-radius: 5px;
  border: 2px solid rgba(15, 20, 25, 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.6);
}
```

## Chip/Badge Styling
```css
background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
border: 1px solid rgba(255, 255, 255, 0.1);
backdrop-filter: blur(4px);
-webkit-backdrop-filter: blur(4px);
border-radius: 16px;
padding: 4px 12px;
```

## Usage Guidelines

### When to Use Glass Effects
- ✅ Cards and containers
- ✅ Navigation bars
- ✅ Modals and dialogs
- ✅ Dropdowns and menus
- ✅ Overlays
- ❌ Small text elements
- ❌ Icons (use solid colors)
- ❌ Borders only (always combine with background)

### Accessibility
- Maintain minimum contrast ratio of 4.5:1 for text
- Use solid backgrounds for critical information
- Ensure interactive elements have clear focus states
- Test with screen readers
- Provide alternative text for images

### Performance Tips
- Use blur values between 8px-20px
- Limit nested glass effects
- Use hardware-accelerated properties (transform, opacity)
- Avoid animating backdrop-filter directly
- Use will-change sparingly

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with -webkit prefix)
- Mobile browsers: Full support on modern devices

## Responsive Breakpoints
```
xs: 0px
sm: 600px
md: 900px
lg: 1200px
xl: 1536px
```

## Mobile Considerations
- Reduce blur intensity on mobile (8px instead of 16px)
- Simplify shadows for better performance
- Increase touch target sizes (minimum 44x44px)
- Use simpler gradients
- Reduce animation complexity
