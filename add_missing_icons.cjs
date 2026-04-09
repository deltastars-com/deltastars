const fs = require('fs');

const iconsStr = `ArrowLeftIcon
ArrowRightIcon
BellIcon
BotIcon
CalendarIcon
ChartBarIcon
CheckCircleIcon
ClockIcon
DeliveryIcon
DocumentTextIcon
DownloadIcon
EyeIcon
FileTextIcon
FilterIcon
FingerprintIcon
GlobeAltIcon
GlobeIcon
HeartIcon
KeyRoundIcon
LayoutIcon
LocationMarkerIcon
LockIcon
LogoIcon
LogoutIcon
MapIcon
MapPinIcon
MegaphoneIcon
MessageCircleIcon
PackageIcon
PencilIcon
PhoneIcon
PlusIcon
QualityIcon
RefreshCcwIcon
RefreshCwIcon
SaveIcon
SearchIcon
SendIcon
SettingsIcon
ShieldCheckIcon
ShoppingBagIcon
ShoppingCartIcon
SparklesIcon
StarIcon
TicketIcon
TrashIcon
TrendingUpIcon
TruckIcon
UserIcon
XIcon`;

const needed = iconsStr.split('\n').filter(Boolean);
let content = fs.readFileSync('/opt/build/repo/Icons.tsx', 'utf8');

for (const icon of needed) {
    if (!content.includes(`export const ${icon}`)) {
        console.log("Adding " + icon);
        content += `\nexport const ${icon} = (props: any) => <svg {...props}><path d=""/></svg>;`;
    }
}

fs.writeFileSync('/opt/build/repo/Icons.tsx', content);
