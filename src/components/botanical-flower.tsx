export default function BotanicalFlower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stem */}
      <path d="M250 610 C249 570 248 530 250 490 C252 455 249 420 250 385" stroke="#5C7A52" strokeWidth="2" strokeLinecap="round" />
      <path d="M250 385 C250 355 250 325 250 295 C250 265 250 240 250 215" stroke="#5C7A52" strokeWidth="1.8" strokeLinecap="round" />

      {/* Lower leaves */}
      <path d="M250 520 C228 505 198 488 172 470 C148 453 140 428 155 415 C170 402 200 412 222 430 C238 443 248 465 250 490" stroke="#4A6741" strokeWidth="1.2" fill="rgba(80,110,70,0.07)" />
      <path d="M250 490 C236 475 218 460 200 448" stroke="#4A6741" strokeWidth="0.6" opacity="0.5" />
      <path d="M250 478 C230 465 214 452 198 442" stroke="#4A6741" strokeWidth="0.4" opacity="0.35" />

      <path d="M250 545 C272 528 302 508 328 488 C352 469 360 443 345 430 C330 417 300 428 278 448 C262 462 252 487 250 510" stroke="#4A6741" strokeWidth="1.2" fill="rgba(80,110,70,0.07)" />
      <path d="M250 510 C264 494 282 478 300 465" stroke="#4A6741" strokeWidth="0.6" opacity="0.5" />

      {/* Mid leaves */}
      <path d="M248 440 C230 428 210 412 192 392 C176 374 175 352 190 344 C205 336 228 350 242 372 C252 388 252 415 250 438" stroke="#4A6741" strokeWidth="1.1" fill="rgba(80,110,70,0.06)" />
      <path d="M250 438 C238 422 224 406 210 393" stroke="#4A6741" strokeWidth="0.5" opacity="0.45" />

      <path d="M252 400 C268 385 290 366 310 346 C328 328 330 306 316 298 C302 290 280 306 266 328 C255 346 251 374 251 398" stroke="#4A6741" strokeWidth="1.1" fill="rgba(80,110,70,0.06)" />
      <path d="M252 398 C264 382 280 364 296 350" stroke="#4A6741" strokeWidth="0.5" opacity="0.45" />

      {/* Upper leaf bud — left */}
      <path d="M248 330 C238 318 224 302 218 284 C213 268 220 254 232 252 C244 250 252 264 254 282 C256 298 252 316 248 330Z" stroke="#4A6741" strokeWidth="1" fill="rgba(200,215,190,0.25)" />
      <path d="M232 252 C224 240 218 226 220 214 C222 204 230 202 236 210" stroke="#4A6741" strokeWidth="0.8" opacity="0.6" />
      <path d="M244 250 C240 236 240 220 244 208 C246 200 252 198 254 208" stroke="#4A6741" strokeWidth="0.8" opacity="0.6" />

      {/* Upper leaf bud — right */}
      <path d="M252 290 C268 272 286 252 292 230 C297 212 290 196 278 196 C266 196 254 212 250 232 C246 250 248 272 252 290Z" stroke="#4A6741" strokeWidth="1" fill="rgba(230,230,225,0.4)" />
      <path d="M278 196 C284 178 284 162 278 150 C274 142 266 140 264 150" stroke="#4A6741" strokeWidth="0.8" opacity="0.55" />
      <path d="M266 194 C264 176 262 158 264 144 C266 134 274 132 276 142" stroke="#4A6741" strokeWidth="0.7" opacity="0.5" />

      {/* Flower petals */}
      <path d="M250 215 C234 188 220 158 220 128 C220 100 232 82 250 82 C268 82 280 100 280 128 C280 158 266 188 250 215Z" stroke="#3A3A38" strokeWidth="1" fill="rgba(248,248,244,0.9)" />
      <path d="M250 215 C250 195 250 165 250 135" stroke="#3A3A38" strokeWidth="0.5" opacity="0.3" />
      <path d="M250 215 C256 195 260 168 258 140" stroke="#3A3A38" strokeWidth="0.4" opacity="0.22" />
      <path d="M250 215 C244 195 240 168 242 140" stroke="#3A3A38" strokeWidth="0.4" opacity="0.22" />

      <path d="M250 215 C272 196 296 176 316 155 C334 136 340 112 328 98 C316 84 294 90 276 108 C258 126 251 174 250 215Z" stroke="#3A3A38" strokeWidth="1" fill="rgba(245,245,240,0.88)" />
      <path d="M250 215 C268 200 288 184 306 165" stroke="#3A3A38" strokeWidth="0.45" opacity="0.25" />

      <path d="M250 215 C278 218 308 224 332 240 C354 255 362 278 350 294 C338 310 314 308 294 292 C272 275 254 242 250 215Z" stroke="#3A3A38" strokeWidth="1" fill="rgba(244,244,238,0.88)" />
      <path d="M250 215 C268 222 290 232 308 248" stroke="#3A3A38" strokeWidth="0.45" opacity="0.25" />

      <path d="M250 215 C222 218 192 224 168 240 C146 255 138 278 150 294 C162 310 186 308 206 292 C228 275 248 242 250 215Z" stroke="#3A3A38" strokeWidth="1" fill="rgba(244,244,238,0.88)" />
      <path d="M250 215 C232 222 210 232 192 248" stroke="#3A3A38" strokeWidth="0.45" opacity="0.25" />

      <path d="M250 215 C228 196 204 176 184 155 C166 136 160 112 172 98 C184 84 206 90 224 108 C242 126 249 174 250 215Z" stroke="#3A3A38" strokeWidth="1" fill="rgba(245,245,240,0.88)" />
      <path d="M250 215 C232 200 212 184 194 165" stroke="#3A3A38" strokeWidth="0.45" opacity="0.25" />

      {/* Sepals */}
      <path d="M238 228 C230 238 220 248 212 258 C206 266 208 272 216 270 C224 268 234 256 240 244" stroke="#4A6741" strokeWidth="0.9" fill="rgba(74,103,65,0.12)" opacity="0.7" />
      <path d="M262 228 C270 238 280 248 288 258 C294 266 292 272 284 270 C276 268 266 256 260 244" stroke="#4A6741" strokeWidth="0.9" fill="rgba(74,103,65,0.12)" opacity="0.7" />

      {/* Pistil and stamens */}
      <path d="M250 215 C250 210 250 205 250 198" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M250 205 C244 198 238 192 234 186" stroke="#8B6914" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      <path d="M250 202 C246 194 244 186 243 178" stroke="#8B6914" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      <path d="M250 200 C252 192 256 185 260 180" stroke="#8B6914" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      <path d="M250 203 C256 196 262 190 266 184" stroke="#8B6914" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      <path d="M250 206 C242 200 236 196 230 194" stroke="#8B6914" strokeWidth="0.7" strokeLinecap="round" opacity="0.65" />
      <path d="M250 206 C258 200 264 196 270 194" stroke="#8B6914" strokeWidth="0.7" strokeLinecap="round" opacity="0.65" />

      {/* Anther dots */}
      <circle cx="234" cy="186" r="2.2" fill="#C4780A" opacity="0.85" />
      <circle cx="243" cy="177" r="2" fill="#C4780A" opacity="0.85" />
      <circle cx="250" cy="174" r="2.2" fill="#C4780A" opacity="0.85" />
      <circle cx="261" cy="179" r="2" fill="#C4780A" opacity="0.85" />
      <circle cx="266" cy="184" r="2.2" fill="#C4780A" opacity="0.85" />
      <circle cx="230" cy="193" r="1.8" fill="#C4780A" opacity="0.75" />
      <circle cx="270" cy="193" r="1.8" fill="#C4780A" opacity="0.75" />

      {/* Center */}
      <circle cx="250" cy="196" r="3" fill="#8B1A1A" opacity="0.9" />
      <circle cx="250" cy="196" r="1.5" fill="#CC2222" opacity="0.8" />
      <path d="M250 193 C248 188 246 183 245 178" stroke="#8B1A1A" strokeWidth="0.7" opacity="0.7" />
      <path d="M250 193 C252 188 254 183 255 178" stroke="#8B1A1A" strokeWidth="0.7" opacity="0.7" />
      <path d="M250 193 C253 189 257 186 261 184" stroke="#8B1A1A" strokeWidth="0.6" opacity="0.6" />
      <path d="M250 193 C247 189 243 186 239 184" stroke="#8B1A1A" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}
