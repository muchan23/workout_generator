import React, { useState, useEffect, useCallback } from 'react';
import { WorkoutMenu, Exercise } from '../lib/types';

interface WorkoutTimerProps {
    workout: WorkoutMenu;
    onCompliete: () => void;
    onPause: () => void;
    onResume: () => void;
}