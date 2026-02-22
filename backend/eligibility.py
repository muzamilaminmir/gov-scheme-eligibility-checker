def check_eligibility(user, scheme):
    """
    Checks if a user is eligible for a given scheme.
    
    Args:
        user (dict): User details {age, income, state, occupation, gender, education}
        scheme (dict): Scheme details from schemes.json
        
    Returns:
        dict: {eligible: bool, reasons: list, rejection_reasons: list}
    """
    eligible = True
    reasons = []
    rejection_reasons = []

    # Education Mapping (Higher is more educated)
    education_levels = {
        "None": 0,
        "Primary": 1,
        "10th Pass": 2,
        "12th Pass": 3,
        "Graduate": 4,
        "Post Graduate": 5
    }

    user_edu_score = education_levels.get(user.get("education", "None"), 0)
    scheme_edu_score = education_levels.get(scheme.get("min_education", "None"), 0)

    # 1. Age Check
    if not (scheme["min_age"] <= user["age"] <= scheme["max_age"]):
        eligible = False
        rejection_reasons.append(f"Age {user['age']} is not within the required range ({scheme['min_age']}-{scheme['max_age']}).")
    else:
        reasons.append(f"Age {user['age']} satisfies the criteria ({scheme['min_age']}-{scheme['max_age']}).")

    # 2. Income Check
    if user["income"] > scheme["max_income"]:
        eligible = False
        rejection_reasons.append(f"Annual income ₹{user['income']} exceeds the maximum limit of ₹{scheme['max_income']}.")
    else:
        reasons.append(f"Annual income ₹{user['income']} is within the limit of ₹{scheme['max_income']}.")

    # 3. Occupation Check
    if "All" not in scheme["occupation"] and user["occupation"] not in scheme["occupation"]:
        eligible = False
        rejection_reasons.append(f"Occupation '{user['occupation']}' is not eligible. Required: {', '.join(scheme['occupation'])}.")
    else:
        reasons.append(f"Occupation '{user['occupation']}' matches scheme requirements.")

    # 4. Gender Check
    if "All" not in scheme["gender"] and user["gender"] not in scheme["gender"]:
        eligible = False
        rejection_reasons.append(f"Gender '{user['gender']}' is not eligible. Required: {', '.join(scheme['gender'])}.")
    else:
        reasons.append(f"Gender '{user['gender']}' is eligible.")

    # 5. State Check
    if "All" not in scheme["states"] and user["state"] not in scheme["states"]:
        eligible = False
        rejection_reasons.append(f"Scheme is only available in: {', '.join(scheme['states'])}. Your state: {user['state']}.")
    else:
        state_info = "Available across India" if "All" in scheme["states"] else f"Available in {user['state']}"
        reasons.append(state_info)

    # 6. Education Check
    if user_edu_score < scheme_edu_score:
        eligible = False
        rejection_reasons.append(f"Education level '{user['education']}' is below required: '{scheme['min_education']}'.")
    else:
        reasons.append(f"Education qualification '{user['education']}' satisfies scheme requirements.")

    return {
        "eligible": eligible,
        "reasons": reasons,
        "rejection_reasons": rejection_reasons
    }
