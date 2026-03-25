import random


# ── Prediction pools ──────────────────────────────────────────────────────────

LOVE_PREDICTIONS = {
    "high": [
        "Your heart line is deep and clear — you are deeply passionate and form strong emotional bonds. A significant romantic connection is on the horizon.",
        "The richness of your heart line reveals an open, loving soul. Your next relationship will be transformative and deeply fulfilling.",
        "Your palm speaks of intense emotional depth. You give love wholeheartedly and attract the same energy in return.",
    ],
    "medium": [
        "Your heart line shows balance — you approach relationships with both logic and emotion. Stability and trust define your partnerships.",
        "You value meaningful connections over fleeting ones. A steady, loyal partner who matches your grounded nature is near.",
        "Your heart line suggests a thoughtful lover who takes time to open up, but forms lasting bonds once trust is established.",
    ],
    "low": [
        "Your heart line is fine and delicate — you are selective in love, but when you commit, it is absolute and unwavering.",
        "You guard your heart carefully, but those who earn your trust experience a love that is rare and profound.",
        "Independence shapes your love life. You thrive with a partner who respects your space while sharing your quiet depth.",
    ],
}

CAREER_PREDICTIONS = {
    "high": [
        "Your head line is bold and extensive — you are destined for leadership. Your analytical mind and drive will take you to exceptional heights.",
        "Your palm shows many crossed paths of success. A major career breakthrough or opportunity is approaching rapidly.",
        "Your lines reveal the mark of an entrepreneur or innovator. Original thinking and fearless action will define your professional journey.",
    ],
    "medium": [
        "Your head line shows steady progress. Hard work and consistency will bring well-deserved recognition in your field.",
        "You excel in collaborative environments. Your ability to connect ideas and people makes you an invaluable team leader.",
        "A creative career path suits your palm. Fields that blend structure with imagination — design, writing, or research — are where you shine.",
    ],
    "low": [
        "Your palm indicates a specialist's journey — a focused, niche career where deep expertise brings quiet but lasting success.",
        "You work better independently and are drawn to careers that offer freedom and flexibility. Remote work or freelancing may be your calling.",
        "Your lines suggest late-blooming success. Patience now will yield significant rewards in your 30s and beyond.",
    ],
}

PERSONALITY_PREDICTIONS = {
    "high": [
        "Your life line is vivid and long — you radiate vitality. Your energy is magnetic, and people gravitate towards your confidence.",
        "Your palm reveals a natural leader with a charismatic presence. Your optimism lights up every room you walk into.",
        "You approach life with fearless curiosity. A born adventurer, you seek experiences that push the boundaries of the ordinary.",
    ],
    "medium": [
        "Your life line shows a balanced personality — introspective yet social, calm yet determined. People rely on you for wisdom and warmth.",
        "You are deeply empathetic, often sensing the emotions of others before they are spoken. This makes you a trusted confidant.",
        "Your palm suggests creative intelligence. You see patterns where others see chaos, and solve problems with elegant simplicity.",
    ],
    "low": [
        "Your life line tells of quiet strength — you may be reserved on the surface, but your inner world is rich and complex.",
        "You are a deep thinker who values solitude. Your insights, when shared, often astound those around you.",
        "Your palm speaks of resilience. You have faced — or will face — significant challenges that ultimately forge an extraordinary character.",
    ],
}


# ── Prediction logic ──────────────────────────────────────────────────────────

def _classify(value: float, low_thresh: float, high_thresh: float) -> str:
    if value >= high_thresh:
        return "high"
    elif value >= low_thresh:
        return "medium"
    else:
        return "low"


def generate_predictions(metrics: dict) -> dict:
    """
    Map image metrics to palmistry predictions using rule-based logic.
    """
    heart_level = _classify(metrics["heart_density"], 0.04, 0.09)
    head_level = _classify(metrics["head_density"], 0.04, 0.09)
    life_level = _classify(metrics["life_density"], 0.04, 0.09)

    # Add slight randomness within same tier for variety across uploads
    love_pred = random.choice(LOVE_PREDICTIONS[heart_level])
    career_pred = random.choice(CAREER_PREDICTIONS[head_level])
    personality_pred = random.choice(PERSONALITY_PREDICTIONS[life_level])

    # Confidence scores (pseudo-random within range for the tier)
    tier_ranges = {"high": (80, 96), "medium": (62, 79), "low": (45, 61)}
    love_conf = random.randint(*tier_ranges[heart_level])
    career_conf = random.randint(*tier_ranges[head_level])
    personality_conf = random.randint(*tier_ranges[life_level])

    return {
        "love": {
            "prediction": love_pred,
            "confidence": love_conf,
            "level": heart_level,
        },
        "career": {
            "prediction": career_pred,
            "confidence": career_conf,
            "level": head_level,
        },
        "personality": {
            "prediction": personality_pred,
            "confidence": personality_conf,
            "level": life_level,
        },
        "summary": {
            "line_count": metrics["line_count"],
            "long_lines": metrics["long_lines"],
            "overall_density": metrics["edge_density"],
        }
    }
