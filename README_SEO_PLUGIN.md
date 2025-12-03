# SEO Plugin - Premium WordPress-Style SEO Tool

A comprehensive SEO analysis and optimization plugin similar to Yoast SEO, Rank Math, and All in One SEO for the Conbyt CMS.

## Features

### 🎯 Real-Time SEO Scoring
- **Overall SEO Score** (0-100) with color-coded indicators
- **Category-specific scores** for different SEO aspects
- **Visual progress bars** and indicators
- **Instant feedback** as you type

### 📊 Comprehensive Analysis

#### 1. **General SEO**
- ✅ Title optimization (30-60 characters)
- ✅ Meta description optimization (120-160 characters)
- ✅ URL slug analysis
- ✅ Focus keyword integration
- ✅ Keyword density analysis (0.5-2.5% optimal)

#### 2. **Content Analysis**
- ✅ Word count analysis (300+ words recommended)
- ✅ Reading time estimation
- ✅ Heading structure (H1, H2, H3)
- ✅ Internal linking (2+ links recommended)
- ✅ External linking (1+ authoritative sources)
- ✅ Image alt text analysis
- ✅ Readability score (Flesch Reading Ease)

#### 3. **Social Media Optimization**
- ✅ Open Graph image (1200x630px)
- ✅ Facebook preview
- ✅ Twitter Card preview
- ✅ LinkedIn preview

#### 4. **Schema Markup**
- ✅ JSON-LD schema generation
- ✅ Article/BlogPosting schema
- ✅ Organization schema
- ✅ One-click copy to clipboard

#### 5. **Live Previews**
- ✅ Google search result preview
- ✅ Facebook post preview
- ✅ Twitter card preview
- ✅ Real-time updates

### 🎨 User Interface

- **Color-coded indicators:**
  - 🟢 Green: Excellent/Passed
  - 🟡 Yellow: Good/Needs improvement
  - 🔴 Red: Poor/Failed

- **Tabbed interface:**
  - General SEO
  - Content Analysis
  - Social Media
  - Preview
  - Schema

- **Progress bars** for character limits
- **Recommendations panel** with actionable suggestions
- **Focus keyword input** for targeted optimization

## Usage

### In Blog Editor

The SEO plugin is automatically integrated into the blog editor:

```jsx
<SEOPlugin formData={formData} onUpdate={setFormData} />
```

### Standalone Usage

```jsx
import SEOPlugin from './components/SEO/SEOPlugin';

<SEOPlugin 
  formData={yourFormData} 
  onUpdate={yourUpdateFunction} 
/>
```

## SEO Score Calculation

The overall SEO score is calculated using weighted factors:

- **Title**: 15%
- **Meta Description**: 15%
- **Content Quality**: 20%
- **Keyword Optimization**: 15%
- **Heading Structure**: 10%
- **Internal/External Links**: 10%
- **Image Optimization**: 5%
- **URL Slug**: 5%
- **OG Image**: 5%

## Analysis Functions

### Title Analysis
- Checks length (30-60 characters)
- Verifies focus keyword inclusion
- Provides real-time feedback

### Meta Description Analysis
- Checks length (120-160 characters)
- Verifies focus keyword inclusion
- Character counter with visual indicator

### Keyword Density
- Calculates keyword frequency
- Optimal range: 0.5-2.5%
- Prevents keyword stuffing

### Content Analysis
- Word count (300+ recommended)
- Reading time calculation
- Sentence length analysis
- Paragraph structure

### Heading Structure
- Verifies 1 H1 per page
- Recommends 2+ H2 headings
- Checks heading hierarchy

### Link Analysis
- Internal links (2+ recommended)
- External links (1+ recommended)
- Link quality assessment

### Image Analysis
- Alt text verification
- Image count
- Accessibility compliance

## Schema Markup

Automatically generates JSON-LD schema including:
- BlogPosting type
- Author information
- Publisher details
- Publication dates
- Main entity of page

## Recommendations System

The plugin provides actionable recommendations:
- **High Priority**: Critical SEO issues (red)
- **Medium Priority**: Important improvements (yellow)
- **Low Priority**: Nice-to-have optimizations (blue)
- **Success**: Positive feedback (green)

## Best Practices

1. **Focus Keyword**: Always set a focus keyword for targeted optimization
2. **Title Length**: Keep between 30-60 characters for optimal display
3. **Meta Description**: Write compelling descriptions (120-160 characters)
4. **Content Length**: Aim for 300+ words, 1000+ for comprehensive topics
5. **Keyword Density**: Maintain 0.5-2.5% for natural optimization
6. **Headings**: Use proper hierarchy (1 H1, multiple H2s)
7. **Links**: Include both internal and external links
8. **Images**: Always add descriptive alt text
9. **OG Image**: Use 1200x630px images for social sharing
10. **Schema**: Add generated schema to page head

## Integration

The SEO plugin integrates seamlessly with:
- Blog editor form
- Real-time validation
- Form data updates
- Preview generation
- Schema markup

## Technical Details

### Dependencies
- React hooks (useState, useEffect)
- React Icons
- Custom SEO analyzer utilities

### Performance
- Efficient real-time calculations
- Optimized re-renders
- Minimal performance impact

### Accessibility
- Screen reader friendly
- Keyboard navigation
- Color contrast compliance

## Future Enhancements

- [ ] Rich text editor integration
- [ ] Advanced keyword research
- [ ] Competitor analysis
- [ ] SERP position tracking
- [ ] Content suggestions
- [ ] AI-powered recommendations
- [ ] Bulk SEO analysis
- [ ] Export SEO reports

## Support

For issues or feature requests, please refer to the main project documentation.

