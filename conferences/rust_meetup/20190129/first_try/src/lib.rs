trait InputDevice {}
trait OutputDevice {}

struct ButtonDevice {}
impl InputDevice for ButtonDevice {}

struct SoundDevice {}
impl OutputDevice for SoundDevice {}


struct Cpu {
    pub inputs: Vec<Box<InputDevice>>,
    pub outputs: Vec<Box<OutputDevice>>,
}

struct Console {
    cpu: Cpu,
    sounds: Vec<SoundDevice>,
    buttons: Vec<ButtonDevice>,
}

impl Console {
    fn new() -> Console {
        let mut cpu = Cpu {
            inputs: Vec::new(),
            outputs: Vec::new(),
        };
        let sound1 = SoundDevice {};
        let sound2 = SoundDevice {};
        let sounds = vec![sound1, sound2];
        cpu.inputs.push(Box::new(sound1));
        cpu.inputs.push(Box::new(sound2));
        let button1 = ButtonDevice {};
        let button2 = ButtonDevice {};
        let buttons = vec![button1, button2];
        cpu.inputs.push(Box::new(button1));
        cpu.inputs.push(Box::new(button2));
        Console {
            cpu,
            sounds,
            buttons,
        }
    }
}
