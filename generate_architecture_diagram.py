import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch

def create_diagram():
    fig = plt.figure(figsize=(24, 13.5), dpi=300)
    fig.patch.set_facecolor('#090D16')
    ax = fig.add_subplot(111)
    ax.set_facecolor('#090D16')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # ── Header ──────────────────────────────────────────────────────────
    ax.text(50, 96.5, "DERMASENSE AI: SYSTEM ARCHITECTURE & COMPUTER VISION PIPELINE",
            fontsize=24, fontweight='black', color='#FFFFFF', ha='center', va='center', fontfamily='sans-serif')
    ax.text(50, 93.8, "Edge Vision Mesh Tracking · OpenCV Mathematical Heuristics · Deep Learning · Content Recommender",
            fontsize=12, fontweight='bold', color='#14B8A6', ha='center', va='center', fontfamily='sans-serif')

    def draw_card(x, y, w, h, bg, border, title="", title_color="#38BDF8"):
        card = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.6,rounding_size=1.2",
                              facecolor=bg, edgecolor=border, linewidth=1.8, zorder=2)
        ax.add_patch(card)
        if title:
            header_rect = FancyBboxPatch((x, y + h - 4.5), w, 4.5, boxstyle="round,pad=0.4,rounding_size=0.8",
                                         facecolor=border, edgecolor='none', alpha=0.18, zorder=3)
            ax.add_patch(header_rect)
            ax.text(x + w/2, y + h - 2.4, title, fontsize=12, fontweight='black', color=title_color,
                    ha='center', va='center', zorder=4)

    def draw_subbox(x, y, w, h, bg, border, title, desc="", tag="", icon_color="#0D9488"):
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.4,rounding_size=0.6",
                             facecolor=bg, edgecolor=border, linewidth=1.2, zorder=5)
        ax.add_patch(box)
        ax.text(x + 1.2, y + h - 1.8, title, fontsize=10, fontweight='black', color='#FFFFFF', va='top', zorder=6)
        if tag:
            tag_box = FancyBboxPatch((x + w - len(tag)*1.0 - 1.5, y + h - 2.4), len(tag)*1.0 + 1.0, 1.6,
                                     boxstyle="round,pad=0.2,rounding_size=0.4", facecolor=icon_color, edgecolor='none', zorder=6)
            ax.add_patch(tag_box)
            ax.text(x + w - len(tag)*0.5 - 1.0, y + h - 1.6, tag, fontsize=7.5, fontweight='black', color='#FFFFFF', ha='center', va='center', zorder=7)
        if desc:
            ax.text(x + 1.2, y + h - 3.4, desc, fontsize=8, fontweight='medium', color='#94A3B8', va='top', zorder=6)

    def draw_arrow(x1, y1, x2, y2, color="#14B8A6", label=""):
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->,head_width=0.45,head_length=0.7", color=color, lw=2.2), zorder=8)
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            lbl_box = FancyBboxPatch((mx - len(label)*0.45 - 0.5, my - 1.0), len(label)*0.9 + 1.0, 2.0,
                                     boxstyle="round,pad=0.2,rounding_size=0.4", facecolor='#090D16', edgecolor=color, lw=1, zorder=9)
            ax.add_patch(lbl_box)
            ax.text(mx, my, label, fontsize=8, fontweight='black', color='#F1F5F9', ha='center', va='center', zorder=10)

    # ── 1. CLIENT TIER (Edge Vision & UI) ──────────────────────────────
    draw_card(3, 40, 28, 50, '#0F172A', '#0D9488', "1. CLIENT LAYER (Edge Vision & UI)", '#2DD4BF')

    draw_subbox(5, 78, 24, 7, '#1E293B', '#334155', "Real-Time Camera Stream", "Webcam acquisition at 1280x720 @ 60 FPS\nDual mirrored & unmirrored coordinate buffers", "60 FPS", "#0D9488")
    draw_subbox(5, 69, 24, 7.5, '#1E293B', '#334155', "MediaPipe Tasks Vision (GPU/Wasm)", "478 3D landmarks (x, y, z) generated client-side\nZero transmission of continuous video to cloud", "Edge AI", "#14B8A6")
    draw_subbox(5, 60, 24, 7.5, '#1E293B', '#334155', "Automated Pose Estimator", "Yaw ratio (L/R edge dispersion) & Pitch tracking\nAuto-capture for Front, Left, Right & Forehead", "Heuristic", "#06B6D4")
    draw_subbox(5, 51, 24, 7.5, '#1E293B', '#334155', "React 19 Frontend (Vite)", "PWA Support · Tailwind CSS v4 · Framer Motion\nRecharts Biometric AreaCharts · Lucide Icons", "React 19", "#6366F1")
    draw_subbox(5, 42, 24, 7.5, '#1E293B', '#334155', "Clinical Face Inspector", "Photographic View · 478 Mesh Overlay · Sebum Heatmap\nInteractive Blemish Focus Pins · 3D Topology Wireframe", "Diagnostic", "#EC4899")

    # ── 2. TRANSPORT & PROTOCOL ───────────────────────────────────────
    draw_arrow(31, 65, 37, 65, "#14B8A6", "HTTP Multipart")

    # ── 3. BACKEND COMPUTER VISION & ML TIER ──────────────────────────
    draw_card(37, 34, 33, 56, '#0F172A', '#0284C7', "2. BACKEND CV & DEEP LEARNING (FastAPI)", '#38BDF8')

    draw_subbox(39, 79.5, 29, 6.5, '#1E293B', '#334155', "FastAPI ASGI Service", "Non-blocking asyncio.to_thread worker pool\nInstant temporary upload purge on completion", "REST API", "#0284C7")
    draw_subbox(39, 71.5, 29, 6.5, '#1E293B', '#334155', "Dual Face Localization Engine", "OpenCV Haar Frontal Cascade + MediaPipe Mesh fallback\n1:1 Center crop & Base64 image compression", "OpenCV", "#0D9488")
    draw_subbox(39, 63.5, 29, 6.5, '#1E293B', '#334155', "Anatomical Skin Masking", "Strict facial ellipse; excludes lips, mouth, eyes & nostrils\nGuarantees 100% blemish detection strictly on skin", "Geometry", "#10B981")
    draw_subbox(39, 47.5, 29, 14.5, '#1E293B', '#334155', "OpenCV Mathematical Analyzers",
                "• Specular Reflection: HSV (V > 215) Sebum & Hydration\n• 2D Laplacian Variance: High-freq texture & pore roughness\n• CIELAB Lightness ΔL*: Infraorbital melanin contrast\n• HSV Red Spectrum: Erythema connected-components blob area\n• Normalized Heatmap Coords: Forehead, Cheeks, Eyes, Nose", "Algorithms", "#F59E0B")
    draw_subbox(39, 36.5, 29, 9.5, '#1E293B', '#334155', "Deep Learning Classifiers",
                "• PyTorch ResNet-18 / Vision Transformer (ViT-B/16)\n• 4-Class Skin Profiler: Oily, Dry, Normal, Combination\n• Acne Lesion Severity Staging & Cystic Risk Index", "PyTorch", "#8B5CF6")

    # ── 4. RECOMMENDER & CLINICAL DATA LAYER ──────────────────────────
    draw_arrow(70, 65, 75, 65, "#14B8A6", "JSON Bio-Metrics")

    draw_card(75, 40, 22, 50, '#0F172A', '#10B981', "3. CLINICAL RECOMMENDER TIER", '#34D399')

    draw_subbox(76.5, 76, 19, 9.5, '#1E293B', '#334155', "214 Formulation DB", "Authentic dermatological formulations\n(Skinpro clinical catalog)\nBrands: CeraVe, The Ordinary, Paula's Choice,\nVenusia Max, Derma Co, Saslic", "Dataset", "#10B981")
    draw_subbox(76.5, 63.5, 19, 10.5, '#1E293B', '#334155', "Content-Based Matcher", "TF-IDF Vectorizer on active ingredients\nCosine Similarity score matching:\n• Acne: Salicylic Acid, Niacinamide\n• Hydration: Hyaluronic Acid, Ceramides\n• Texture: Glycolic Acid, BHA Liquid", "Cosine Sim", "#0D9488")
    draw_subbox(76.5, 52, 19, 9.5, '#1E293B', '#334155', "Retail E-Commerce Integration", "Automated direct store deep-linking\nAmazon India + Dermatics query links\nMatch percentage score (82% - 99%)", "Amazon/Stores", "#F97316")
    draw_subbox(76.5, 42, 19, 8.5, '#1E293B', '#334155', "Regimen Composer", "AM/PM clinical step schedules\nBarrier compatibility checking\nReal product images & ratings", "Protocol", "#6366F1")

    # ── 5. BOTTOM OUTPUT & TELEMETRY TIER ─────────────────────────────
    draw_card(3, 5, 94, 25, '#0F172A', '#8B5CF6', "4. CLINICAL OUTPUT & INTERACTIVE REPORT DASHBOARD", '#A78BFA')

    draw_subbox(5, 7, 21, 18, '#1E293B', '#334155', "13 Biometric Bio-Markers",
                "• Cellular Glow Score (0-100)\n• Estimated Skin Age\n• Epidermal Barrier Resilience\n• Specular Hydration Index (%)\n• Laplacian Texture Roughness (%)\n• Pigmentation Risk Score (%)\n• CIELAB Dark Circle Grade\n• Active Blemish Focus Count", "Metrics", "#EC4899")

    draw_subbox(28.5, 7, 21, 18, '#1E293B', '#334155', "Photographic Face Inspector",
                "• 4 Standardized Angle Views\n  (Front, Left, Right, Forehead)\n• Live 478 Landmark Mesh SVG\n• T-Zone & Cheek Sebum Heatmaps\n• Interactive Erythema Pins\n• Hotspot Tooltip Inspection\n• WebGL 3D Mesh Mode Toggle", "Inspector", "#06B6D4")

    draw_subbox(52, 7, 21, 18, '#1E293B', '#334155', "Longitudinal Adherence",
                "• Daily Skincare Regimen Ring\n• AM/PM Protocol Checklist\n• 7-Day Metric Trend Curves\n  (Recharts AreaCharts)\n• Photographic Daily Log\n• Longitudinal Improvement Index", "Tracker", "#10B981")

    draw_subbox(75.5, 7, 20, 18, '#1E293B', '#334155', "Clinical Report & Export",
                "• Biometric Summary Table\n• Formulation Active Actives\n• CSS Print-Ready Formatting\n• Zero-Leak Session Cleanup\n• Full Browser Edge Resiliency\n• Tele-Dermatology Ready", "Export", "#F59E0B")

    # Arrow connections between backend and output
    draw_arrow(53.5, 34, 53.5, 30, "#8B5CF6", "Structured Diagnostic Payload")

    out_path = os.path.abspath('architecture_diagram.png')
    plt.savefig(out_path, bbox_inches='tight', facecolor='#090D16', dpi=300)
    plt.close()
    print("Architecture diagram successfully generated at:", out_path)

if __name__ == '__main__':
    create_diagram()
