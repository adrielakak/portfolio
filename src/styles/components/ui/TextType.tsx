'use client';

import React, {
  useEffect,
  useRef,
  useState,
  createElement,
  useMemo,
  useCallback,
  ElementType,
} from 'react';
import { gsap } from 'gsap';
import './TextType.css';

type VariableSpeed = { min: number; max: number };

type TextTypeProps<T extends ElementType = 'div'> = {
  text: string | string[];
  as?: T;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: VariableSpeed;
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, 'children'>;

export default function TextType<T extends ElementType = 'div'>({
  text,
  as,
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps<T>) {
  const Component = (as || 'div') as ElementType;

  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const blinkTween = useRef<gsap.core.Tween | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textArray = useMemo<string[]>(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (!textColors.length) return '#ffffff';
    return textColors[currentTextIndex % textColors.length];
  };

  // Démarrage à la visibilité
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const el = containerRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [startOnVisible]);

  // Curseur clignotant
  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;
    blinkTween.current?.kill();
    gsap.set(cursorRef.current, { opacity: 1 });
    blinkTween.current = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });
    return () => {
      blinkTween.current?.kill();
      blinkTween.current = null;
    };
  }, [showCursor, cursorBlinkDuration]);

  // Typing loop robuste
  useEffect(() => {
    if (!isVisible) return;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current as any);
        timerRef.current = null;
      }
    };

    clearTimer();

    const currentTextRaw = textArray[currentTextIndex] ?? '';
    const processedText = reverseMode
      ? currentTextRaw.split('').reverse().join('')
      : currentTextRaw;
    const total = processedText.length;

    // helper: planifie avec délai
    const later = (fn: () => void, ms: number) => {
      timerRef.current = setTimeout(fn, ms);
    };

    // 1) état initial (optionnel : initialDelay)
    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      later(() => {
        setDisplayedText(processedText.slice(0, 1));
        setCurrentCharIndex(1);
      }, initialDelay || (variableSpeed ? getRandomSpeed() : typingSpeed));
      return () => clearTimer();
    }

    // 2) Typing en cours
    if (!isDeleting && currentCharIndex < total) {
      later(() => {
        setDisplayedText(processedText.slice(0, currentCharIndex + 1));
        setCurrentCharIndex((i) => i + 1);
      }, variableSpeed ? getRandomSpeed() : typingSpeed);
      return () => clearTimer();
    }

    // 3) Fin de frappe → pause → commence la suppression (si on boucle)
    if (!isDeleting && currentCharIndex >= total) {
      if (textArray.length > 1 || loop) {
        later(() => setIsDeleting(true), pauseDuration);
      }
      return () => clearTimer();
    }

    // 4) Suppression caractère par caractère
    if (isDeleting && currentCharIndex > 0) {
      later(() => {
        setDisplayedText(processedText.slice(0, currentCharIndex - 1));
        setCurrentCharIndex((i) => i - 1);
      }, deletingSpeed);
      return () => clearTimer();
    }

    // 5) Fin de suppression (currentCharIndex === 0)
    if (isDeleting && currentCharIndex === 0) {
      // callback de fin de phrase
      if (onSentenceComplete) onSentenceComplete(currentTextRaw, currentTextIndex);

      // si pas de loop et dernière phrase → stop
      if (!loop && currentTextIndex === textArray.length - 1) {
        setIsDeleting(false);
        return () => clearTimer();
      }

      // après la pause, avance à la phrase suivante (ou reste sur la même si une seule)
      later(() => {
        setCurrentTextIndex((idx) =>
          textArray.length > 1 ? (idx + 1) % textArray.length : idx
        );
        setIsDeleting(false);
        setDisplayedText('');       // propre redémarrage
        setCurrentCharIndex(0);
      }, pauseDuration);

      return () => clearTimer();
    }

    return () => clearTimer();
  }, [
    isVisible,
    textArray,
    currentTextIndex,
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    reverseMode,
    variableSpeed,
    getRandomSpeed,
    onSentenceComplete,
  ]);

  const currentFullText = textArray[currentTextIndex] ?? '';
  const currentLen = currentFullText.length;
  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < currentLen || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef as any,
      className: `text-type ${className}`,
      ...props,
    },
    <span
      className="text-type__content"
      style={{ color: getCurrentTextColor() }}
      aria-live="polite"
      aria-atomic="true"
    >
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${
          shouldHideCursor ? 'text-type__cursor--hidden' : ''
        }`}
        aria-hidden={shouldHideCursor ? 'true' : 'false'}
      >
        {cursorCharacter}
      </span>
    )
  );
}
