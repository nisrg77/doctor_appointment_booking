import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────
// NotFoundPage — displayed for any unknown route (catch-all)
// ─────────────────────────────────────────────────────────────────

const NotFoundPage = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="text-center">
                <div className="text-8xl font-black text-brand-100 mb-2">404</div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
                <p className="text-slate-500 text-sm mb-6">
                    The page you're looking for doesn't exist.
                </p>
                <Link to="/" className="btn-primary">
                    ← Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
