$files = @{
    "documents/lore/overview.txt" = "주제: 엔젤릭버스터 개요`r`n// 배경 스토리, 정체성, 기본 설정 등 전반적인 소개를 적어주세요."
    "documents/lore/personality.txt" = "주제: 성격`r`n// 아이돌로서의 활기찬 모습과 티어로서의 본래 성격 차이점 등을 적어주세요."
    "documents/lore/story.txt" = "주제: 스토리`r`n// 주요 스토리 라인, 탄생 배경, 퀘스트 흐름 등을 적어주세요."
    "documents/lore/relationships.txt" = "주제: 인물 관계`r`n// 매그너스, 카이저, 에스카다 등 주변 인물과의 관계를 적어주세요."
    "documents/lore/hometown.txt" = "주제: 출신지 (판테온)`r`n// 판테온 지역 설명과 노바 종족 설정 등을 적어주세요."
    "documents/lore/trivia.txt" = "주제: 트리비아`r`n// 재미있는 사실, 이스터에그, 자잘한 설정 등을 적어주세요."

    "documents/visuals/job_effects.txt" = "주제: 스킬 이펙트`r`n// 스킬 사용 시 나타나는 화려한 시각 효과, 마법소녀 연출 등을 설명해주세요."
    "documents/visuals/appearance.txt" = "주제: 외형`r`n// 캐릭터 디자인 특징, 변신 전후 모습 등을 설명해주세요."
    "documents/visuals/dress_up_system.txt" = "주제: 드레스업 시스템`r`n// 코디 변경 시스템의 작동 방식 설명."
    "documents/visuals/skill_voice.txt" = "주제: 스킬 보이스`r`n// 스킬 사용 시 나오는 대사들을 적어주세요."

    "documents/gameplay/history.txt" = "주제: 업데이트 내역`r`n// 패치 노트, 밸런스 패치 역사, 과거 성능 변화 등을 적어주세요."
    "documents/gameplay/skills.txt" = "주제: 스킬 정보`r`n// 액티브/패시브 스킬 목록과 각 스킬의 효과를 상세히 적어주세요."
    "documents/gameplay/performance.txt" = "주제: 성능 평가`r`n// DPM, 보스전 성능, 사냥 성능 등 실전 성능 분석."
    "documents/gameplay/playstyle.txt" = "주제: 플레이 스타일`r`n// 딜 사이클, 조작법, 운용 팁 등을 적어주세요."
    "documents/gameplay/pros_cons.txt" = "주제: 장점과 단점`r`n// 직업의 확실한 장점과 단점을 정리해주세요."
    "documents/gameplay/v_matrix.txt" = "주제: V 매트릭스 & 6차`r`n// 코어 강화 우선순위, 5차/6차 스킬 정보 등을 적어주세요."
    "documents/gameplay/ability.txt" = "주제: 어빌리티`r`n// 추천 어빌리티 옵션 정리를 적어주세요."
    "documents/gameplay/union.txt" = "주제: 유니온 & 링크 스킬`r`n// 유니온 공격대원 효과와 링크 스킬 효과를 적어주세요."
    "documents/gameplay/equipment.txt" = "주제: 장비 셋팅`r`n// 소울 슈터, 엠블렘, 보조무기 등 아이템 셋팅 가이드."

    "documents/media/albums.txt" = "주제: 앨범 & 노래`r`n// Star Bubble, Fly Away 등 부른 노래 목록과 가사 정보."
    "documents/media/other_media.txt" = "주제: 미디어 믹스`r`n// 홍보 영상, 콜라보레이션 등 게임 외 활동 정보."

    "documents/controversy/controversies.txt" = "주제: 논란 및 이슈`r`n// 알려진 버그, 과거 논란, 유저 여론 등을 적어주세요."
}

foreach ($file in $files.Keys) {
    Set-Content -Path $file -Value $files[$file] -Encoding UTF8
    Write-Host "Updated $file (Korean)"
}
