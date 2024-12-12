import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import { useState } from 'react';

export default function ShareButtons() {
    const [copied, setCopied] = useState(false);

    const currentURL = typeof window !== 'undefined' ? window.location.href : '';
    const title = "Générateur de Quittances de Loyer - Un outil gratuit pour les propriétaires";
    const description = "Générez facilement et gratuitement vos quittances de loyer en ligne. Un outil simple et rapide pour les propriétaires et gestionnaires immobiliers.";

    const shareLinks = [
        {
            name: 'Twitter',
            icon: <FaTwitter className="w-5 h-5" />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(currentURL)}`,
            color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]'
        },
        {
            name: 'Facebook',
            icon: <FaFacebook className="w-5 h-5" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}&quote=${encodeURIComponent(description)}`,
            color: 'bg-[#4267B2] hover:bg-[#365899]'
        },
        {
            name: 'LinkedIn',
            icon: <FaLinkedin className="w-5 h-5" />,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
            color: 'bg-[#0077B5] hover:bg-[#006399]'
        },
        {
            name: 'WhatsApp',
            icon: <FaWhatsapp className="w-5 h-5" />,
            url: `https://wa.me/?text=${encodeURIComponent(description + ' ' + currentURL)}`,
            color: 'bg-[#25D366] hover:bg-[#20bd5a]'
        }
    ];

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentURL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset après 2 secondes
        } catch (err) {
            console.error('Erreur lors de la copie :', err);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Partager l'outil
            </h2>
            <p className="text-gray-600 text-sm mb-4">
                Aidez d'autres propriétaires à découvrir cet outil gratuit
            </p>
            <div className="flex flex-wrap gap-3">
                {shareLinks.map((platform) => (
                    <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition-all ${platform.color}`}
                        aria-label={`Partager sur ${platform.name}`}
                    >
                        {platform.icon}
                        <span className="hidden sm:inline">{platform.name}</span>
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition-all ${copied
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                    aria-label="Copier le lien"
                >
                    {copied ? (
                        <>
                            <MdCheck className="w-5 h-5" />
                            <span className="hidden sm:inline">Copié !</span>
                        </>
                    ) : (
                        <>
                            <MdContentCopy className="w-5 h-5" />
                            <span className="hidden sm:inline">Copier le lien</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
