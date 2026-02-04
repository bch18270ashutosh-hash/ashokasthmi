"use client";

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCcw, Loader2 } from 'lucide-react';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedFile: File) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isProcessing, setIsProcessing] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
    }, [aspectRatio]);

    const getCroppedImg = useCallback(async (): Promise<File | null> => {
        const image = imgRef.current;
        if (!image || !completedCrop) return null;

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    resolve(file);
                } else {
                    resolve(null);
                }
            }, 'image/jpeg', 0.9);
        });
    }, [completedCrop]);

    const handleConfirm = async () => {
        setIsProcessing(true);
        const croppedFile = await getCroppedImg();
        if (croppedFile) {
            onCropComplete(croppedFile);
        }
        setIsProcessing(false);
    };

    const resetCrop = () => {
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            setCrop(centerAspectCrop(width, height, aspectRatio));
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display font-bold text-slate-900">Crop Image</h3>
                    <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-slate-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center" style={{ maxHeight: '400px' }}>
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspectRatio}
                        className="max-h-[400px]"
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop preview"
                            onLoad={onImageLoad}
                            style={{ maxHeight: '400px', maxWidth: '100%' }}
                        />
                    </ReactCrop>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={resetCrop}
                        className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isProcessing || !completedCrop}
                        className="flex-1 py-3 px-4 bg-primary-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
