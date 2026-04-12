import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="hidden md:block border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple to-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="font-bold text-xl">SocialShop</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The social commerce platform where shopping meets community.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-foreground transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=home" className="hover:text-foreground transition-colors">Home & Garden</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/feed" className="hover:text-foreground transition-colors">Feed</Link></li>
              <li><Link to="/explore" className="hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link to="/posts/create" className="hover:text-foreground transition-colors">Create Post</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Seller Guide</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex items-center justify-between text-sm text-muted-foreground">
          <p>2024 SocialShop. All rights reserved.</p>
          <p>Built with React + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
