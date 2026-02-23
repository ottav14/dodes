export const distance = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

export const pointToLine = (lx1: number, ly1: number, lx2: number, ly2: number, px: number, py: number) => {
    const APx = px - lx1;
    const APy = py - ly1;
    
    const ABx = lx2 - lx1;
    const ABy = ly2 - ly1;
    
    const AB_len2 = ABx * ABx + ABy * ABy;
    
    if (AB_len2 === 0)
        return Math.hypot(APx, APy);
    
    let t = (APx * ABx + APy * ABy) / AB_len2;
    
    t = Math.max(0, Math.min(1, t));
    
    const closestX = lx1 + t * ABx;
    const closestY = ly1 + t * ABy;
    
    const dx = px - closestX;
    const dy = py - closestY;
    return Math.hypot(dx, dy);
}

export const lerp = (a: number, b: number, t: number) => {
    return a + (b - a) * t;
}
