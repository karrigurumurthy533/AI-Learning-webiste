/**
 * Split text into chunks without breaking paragraphs
 * @param {string} text - Full text to chunk
 * @param {object} options - Options for chunking
 * @param {number} options.chunkSize - Target size per chunk (in words, default 100)
 * @param {number} options.overlap - Number of words to overlap between chunks (default 0)
 * @returns {Array<{content:string, chunkIndex:number, pageNumber:number}>} - Array of chunk objects
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) return [];

    // Normalize newlines and split into paragraphs
    const cleanedText = text
        .replace(/\r\n/g, "\n")
        .replace(/\s+/,'')
        .replace(/\n/g, "\n") // (kept as-is)
        .replace(/\n/g, "\n") // (kept as-is)
        .trim(); // ❌ removed .replace(/\s+/g, "") bug

    // try to split by paragraphs
    const paragraphs = cleanedText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.split(/\s+/); // ✅ fixed "para"
        const paragraphWordCount = paragraphWords.length;

        // If single paragraph exceeds chunkSize
        if (paragraphWordCount > chunkSize) {
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            // split large paragraph into word-based chunks
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });

                if (i + chunkSize >= paragraphWords.length) break;
            }
            continue;
        }

        // if adding exceeds chunk size
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            // create overlap
            const prevChunkText = currentChunk.join(' ');
            const prevWords = prevChunkText.split(/\s+/);
            const overlapText = prevWords
                .slice(-Math.min(overlap, prevWords.length))
                .join(' ');

            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount =
                overlapText.split(/\s+/).length + paragraphWordCount;

        } else {
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }
    }

    // Add last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }

    // fallback
    if (chunks.length === 0 && cleanedText.length > 0) {
        const allWords = cleanedText.split(/\s+/);

        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) { // ✅ fixed
            const chunkWords = allWords.slice(i, i + chunkSize);

            chunks.push({
                content: chunkWords.join(' '), // ✅ fixed
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            if (i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};

/**
 * Split text into chunks without breaking paragraphs
 * @param {Array<Object>} chunks - Array of Chunks
 * @param {string} query-Search Query
 * @param {number} maxChunks -Maximum chunks to return
 * @returns {Array<Object>} - Array of chunk objects
 */


export const findRelevantChunks = ({ chunks, query, maxChunks = 3 }) => {
    if (!chunks || chunks.length === 0 || !query) return [];

    const stopWords = new Set([
        "a","an","the","and","or","but","if","while","with","to","of","at","by","for",
        "from","up","about","into","over","after","before","between","out","against",
        "during","without","within","along","across","behind","beyond",
        "is","am","are","was","were","be","been","being",
        "have","has","had","do","does","did",
        "this","that","these","those",
        "he","she","it","they","them","his","her","their",
        "as","in","on","off","so","than","too","very","can","will","just"
    ]);

    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    if (queryWords.length === 0) {
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }

    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;

        let score = 0;

        for (const word of queryWords) {
            const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, "g")) || []).length;
            score += exactMatches * 3;

            const partialMatches = (content.match(new RegExp(word, "g")) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        // Count unique query words found
        const uniqueWordsFound = queryWords.filter(word =>
            content.includes(word)
        ).length;

        if (uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2; // ✅ fixed
        }

        // Normalize
        const normalizedScore = score / Math.max(contentWords, 1);

        // Position bonus (earlier chunks slightly better)
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchWords: uniqueWordsFound
        };
    });

    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.matchWords !== a.matchWords) return b.matchWords - a.matchWords;
            return a.chunkIndex - b.chunkIndex;
        })
        .slice(0, maxChunks);
};















