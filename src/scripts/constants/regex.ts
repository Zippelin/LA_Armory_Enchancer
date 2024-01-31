export const MAX_GEAR_POWER: RegExp =
    /.+<div class="level-info2__item"><span>Максимальный рейтинг<\/span><span><small>Ур.<\/small>(?<currentGearsMain>\d*,*\d+).+(?<currentGearsSecondary>.*\d\d)/;
export const CURRENT_GEAR_POWER: RegExp =
    /.+<div class="level-info2__expedition"><span>Текущий рейтинг снаряжения<\/span><span><small>Ур.<\/small>(?<currentGearsMain>\d*,*\d+).+(?<currentGearsSecondary>.*\d\d)/;
export const CLASS_ICON_URL: RegExp =
    /.+<img class="profile-character-info__img" src="(?<iconPath>.+?)"/;
export const SCRIPT_PROFILE: RegExp =
    /.*<script type="text\/javascript">[\S\s]*Profile = (?<profileData>\{[\S\s]+\});\n<\/script>/;
export const ELIXIR_DATA: RegExp =
    /<FONT.*>(?<itemType>\[.*?\])<\/FONT>(?<exilirName>.+?)<FONT.+>(?<elixirLevel>\d+)/;
export const ENGRAVES_DATA: RegExp =
    /(?<engraveName>[А-яё]+[\s-]*[А-яё]*)\s(?<engraveLevel>\d)\sур/g;
export const STATS_DATA: RegExp =
    /(?<statName>Смертоносность|Подавление|Мастерство|Подавление|Стойкость|Искусность|Сноровка).+?(?<statValue>\d+)/g;
