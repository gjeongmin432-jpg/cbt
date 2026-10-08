import os
import re
import json

def parse_all():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    q_path = os.path.join(base_dir, "실기 문제.txt")
    a_path = os.path.join(base_dir, "실기 해설.txt")
    out_path = os.path.join(base_dir, "src", "data", "questions.json")

    with open(q_path, "r", encoding="utf-8") as f:
        q_raw = f.read()

    with open(a_path, "r", encoding="utf-8") as f:
        a_raw = f.read()

    # Split rounds
    q_round_matches = list(re.finditer(r'\[제(\d+)회 모의고사\]', q_raw))
    a_round_matches = list(re.finditer(r'\[제(\d+)회 모의고사\]', a_raw))

    q_rounds_dict = {}
    for i, m in enumerate(q_round_matches):
        r_num = int(m.group(1))
        start_pos = m.end()
        end_pos = q_round_matches[i+1].start() if i+1 < len(q_round_matches) else len(q_raw)
        q_rounds_dict[r_num] = q_raw[start_pos:end_pos]

    a_rounds_dict = {}
    for i, m in enumerate(a_round_matches):
        r_num = int(m.group(1))
        start_pos = m.end()
        end_pos = a_round_matches[i+1].start() if i+1 < len(a_round_matches) else len(a_raw)
        a_rounds_dict[r_num] = a_raw[start_pos:end_pos]

    all_questions = []

    for r_num in range(1, 11):
        q_text = q_rounds_dict.get(r_num, "")
        a_text = a_rounds_dict.get(r_num, "")

        # Find all questions in q_text
        # Matches: 【문 X】(유형) or 【문 X】 (유형)
        q_item_matches = list(re.finditer(r'【문\s*(\d+)】([^\n]*)', q_text))
        a_item_matches = list(re.finditer(r'【문\s*(\d+)】\s*정답', a_text))

        q_map = {}
        for idx, qm in enumerate(q_item_matches):
            q_num = int(qm.group(1))
            type_raw = qm.group(2).strip()
            # clean type: e.g. (단답형) -> 단답형
            m_type = re.search(r'\((.*?)\)', type_raw)
            q_type = m_type.group(1).strip() if m_type else (type_raw or "단답형")
            
            body_start = qm.end()
            body_end = q_item_matches[idx+1].start() if idx+1 < len(q_item_matches) else len(q_text)
            raw_body = q_text[body_start:body_end]

            # Clean raw_body: remove section headers like [과목 2: 위험물안전관리법 (문8 ~ 문20)] and trailing separator lines
            clean_body = re.sub(r'\[과목\s*\d+:[^\]]+\]', '', raw_body)
            clean_body = re.sub(r'=+', '', clean_body)
            clean_body = clean_body.strip()

            q_map[q_num] = {
                "type": q_type,
                "question": clean_body
            }

        a_map = {}
        for idx, am in enumerate(a_item_matches):
            a_num = int(am.group(1))
            body_start = am.end()
            body_end = a_item_matches[idx+1].start() if idx+1 < len(a_item_matches) else len(a_text)
            raw_ans_block = a_text[body_start:body_end]

            # Remove section headers & dividers
            raw_ans_block = re.sub(r'\[과목\s*\d+:[^\]]+\]', '', raw_ans_block)
            raw_ans_block = re.sub(r'=+', '', raw_ans_block)
            raw_ans_block = raw_ans_block.strip()

            # Split into modelAnswer and explanation
            # Look for [해설]
            expl_match = re.search(r'\[해설\]', raw_ans_block)
            if expl_match:
                model_ans = raw_ans_block[:expl_match.start()].strip()
                explanation = raw_ans_block[expl_match.end():].strip()
            else:
                model_ans = raw_ans_block.strip()
                explanation = ""

            a_map[a_num] = {
                "modelAnswer": model_ans,
                "explanation": explanation
            }

        for q_num in range(1, 21):
            category = "화재예방과 소화방법" if q_num <= 7 else "위험물안전관리법"
            q_info = q_map.get(q_num, {"type": "단답형", "question": ""})
            a_info = a_map.get(q_num, {"modelAnswer": "", "explanation": ""})

            q_obj = {
                "id": f"{r_num}-{q_num}",
                "round": r_num,
                "number": q_num,
                "category": category,
                "type": q_info["type"],
                "question": q_info["question"],
                "modelAnswer": a_info["modelAnswer"],
                "explanation": a_info["explanation"]
            }
            all_questions.append(q_obj)

    print(f"Total parsed questions: {len(all_questions)}")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)

    print(f"Saved to {out_path}")

    # Validation
    empty_q = [q["id"] for q in all_questions if not q["question"]]
    empty_ans = [q["id"] for q in all_questions if not q["modelAnswer"]]
    print(f"Empty questions: {len(empty_q)} {empty_q}")
    print(f"Empty answers: {len(empty_ans)} {empty_ans}")
    print("Sample question 1-1:")
    print(json.dumps(all_questions[0], ensure_ascii=False, indent=2))
    print("Sample question 1-5:")
    print(json.dumps(all_questions[4], ensure_ascii=False, indent=2))
    print("Sample question 10-20:")
    print(json.dumps(all_questions[-1], ensure_ascii=False, indent=2))

if __name__ == "__main__":
    parse_all()
