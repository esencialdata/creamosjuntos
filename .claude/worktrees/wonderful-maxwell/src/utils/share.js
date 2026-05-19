export const shareContent = async (title, text, url) => {
    const fullText = `${text} ${url}`;

    // 1. Try Native Share (Mobile)
    // Note: Only works in secure contexts (HTTPS or localhost)
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text, // Pass clean text, let the OS handle the URL placement
                url: url
            });
            return;
        } catch (error) {
            // User cancelled or API failed
            if (error.name !== 'AbortError') {
                console.warn('Navigator.share failed, trying fallback:', error);
            } else {
                return; // User cancelled, do nothing
            }
        }
    }

    // 2. Try Modern Clipboard API
    // Note: Also requires secure context
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(fullText);
            alert("¡Copiado! Ya puedes pegarlo en WhatsApp o donde quieras.");
            return;
        } catch (error) {
            console.warn('Clipboard API failed, trying legacy fallback:', error);
        }
    }

    // 3. Legacy Textarea Hack (Works in most non-secure contexts)
    try {
        const textArea = document.createElement("textarea");
        textArea.value = fullText;

        // Ensure it's not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            alert("¡Copiado! Ya puedes pegarlo en WhatsApp o donde quieras.");
            return;
        }
    } catch (err) {
        console.error('Legacy copy failed:', err);
    }

    // 4. Last Resort: Prompt
    prompt("No pudimos copiarlo automáticamente. Por favor copia este texto manualmante:", fullText);
};
