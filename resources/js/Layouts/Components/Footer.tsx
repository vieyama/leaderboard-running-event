import { Link } from '@inertiajs/react';

const Footer = () => {
    return (
        <footer>
            <div className="max-w-6xl px-4 mx-auto sm:px-6">
                {/* Top area: Blocks */}
                <div
                    className="flex items-center justify-center py-4"
                >
                    <div className="text-sm text-gray-600">
                        &copy; S2P - All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
