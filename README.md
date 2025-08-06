# ManaCustom Choco - Custom Chocolate Wrapper Gallery

A beautiful Next.js application for showcasing custom chocolate wrappers with admin functionality, late-night pricing, and interactive gallery features.

## Features

### 🎨 **Gallery Features**
- Beautiful responsive gallery with grid and list view modes
- Interactive lightbox for detailed wrapper viewing
- Like functionality for favorite wrappers
- Search and filter capabilities
- Late-night special pricing (10 PM - 6 AM IST)
- Smooth animations with Framer Motion

### 🔧 **Admin Features**
- Secure admin authentication
- Upload new wrapper designs
- Manage wrapper visibility and pricing
- Set late-night special prices
- Schedule wrapper releases
- Analytics dashboard with insights

### 💡 **Technical Features**
- Built with Next.js 15 and TypeScript
- MongoDB database integration
- File upload with image optimization
- Responsive design with Tailwind CSS
- IST timezone support for late-night pricing
- Toast notifications for user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd manacustomchoco
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/manacustomchoco
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
UPLOAD_DIR=public/uploads
MAX_FILE_SIZE=5242880
```

3. **Start MongoDB** (if using local installation)

4. **Seed the database with sample data:**
```bash
npm run seed
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
- Main gallery: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

## 🎯 Usage

### For Users
1. Browse the beautiful collection of custom chocolate wrappers
2. Use the search bar to find specific designs
3. Switch between grid and list view modes
4. Click on any wrapper to view in detailed lightbox
5. Like your favorite designs
6. Take advantage of late-night special pricing!

### For Admins
1. Go to `/admin` and login with your credentials
2. **Upload Tab**: Add new wrapper designs with details
3. **Wrappers Tab**: Manage existing wrappers, toggle visibility
4. **Analytics Tab**: View insights about popular designs

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin pages
│   └── page.tsx      # Main gallery page
├── components/
│   ├── admin/        # Admin-specific components
│   ├── Hero.tsx      # Landing hero section
│   ├── WrapperGallery.tsx    # Main gallery component
│   ├── WrapperCard.tsx       # Individual wrapper card
│   └── Lightbox.tsx          # Image lightbox
├── lib/
│   ├── mongodb.ts    # Database connection
│   └── utils.ts      # Utility functions
└── types/
    └── index.ts      # TypeScript interfaces
```

## 🌙 Late-Night Pricing Feature

The application automatically applies special pricing during late-night hours (10 PM - 6 AM IST):
- Wrappers marked as "Late Night Special" show discounted prices
- Visual indicators highlight the special pricing
- Automatic timezone detection ensures accurate pricing

## 🔒 Security Features

- Password hashing with bcryptjs
- Input validation and sanitization
- File type restrictions for uploads
- Authentication required for admin functions
- Environment-based configuration

## 🎨 Customization

### Colors and Theming
The app uses a warm color palette perfect for chocolate themes:
- Primary: Amber/Orange gradients
- Accent: Gold and warm tones
- UI: Clean grays with warm undertones

### Adding New Features
1. **Database Models**: Update `src/types/index.ts`
2. **API Routes**: Add new routes in `src/app/api/`
3. **Components**: Create reusable components in `src/components/`
4. **Styling**: Use Tailwind CSS classes

## 📱 Responsive Design

The application is fully responsive and works beautifully on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm start
```

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Credits

Built with love using:
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
- [Lucide React](https://lucide.dev/)

---

**Happy chocolate wrapping! 🍫✨**
