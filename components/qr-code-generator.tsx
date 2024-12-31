"use client"

import React, { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, RefreshCw, LinkIcon } from 'lucide-react'

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('')
  const qrRef = useRef<SVGSVGElement>(null)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const canvas = document.createElement("canvas");
    const svg = qrRef.current;
    const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
    const w = parseInt(svg.getAttribute("width") || "0");
    const h = parseInt(svg.getAttribute("height") || "0");
    const img_to_download = document.createElement('img');
    img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
    img_to_download.onload = function () {
      canvas.setAttribute('width', w.toString());
      canvas.setAttribute('height', h.toString());
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(img_to_download, 0, 0, w, h);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'QRCode.png';
        link.href = dataURL;
        link.click();
      }
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="url"
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={handleUrlChange}
                className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-center">
            {url ? (
              <div className="p-4 bg-white rounded-lg shadow-inner">
                <QRCodeSVG
                  value={url}
                  size={200}
                  ref={qrRef}
                  includeMargin={true}
                  bgColor={"#FFFFFF"}
                  fgColor={"#000000"}
                  level={"L"}
                  className="rounded-md"
                />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 text-sm text-center px-4">Enter a URL to generate a QR code</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button
            onClick={() => setUrl('')}
            variant="outline"
            disabled={!url}
            className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button
            onClick={downloadQRCode}
            disabled={!url}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

